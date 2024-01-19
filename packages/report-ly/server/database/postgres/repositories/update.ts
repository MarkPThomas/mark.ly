public static function updateReportInDatabaseFromJSON($data) {
  $report = Lib\JsonHandler:: decode($data, $assoc = true);
  self:: updateReportInDatabase($report);
}

public static function updateReportInDatabase(Report $report) {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  // 1. Update page & report_trips page
  // 2. Clear current report (remove all report body entries)
  // 3. Re-add report bodies, photos, etc.
  // 4. Add albums, links, etc. & references if new


}


public static function associatePhotosToAlbums() {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = "SELECT id
          FROM report_trip";
  $query = $database -> prepare($sql);
  $query -> execute();
  $reports = $query -> fetchAll();

  // For each trip report
  foreach($reports as $report){
    if (!isset($report -> id)) continue;
    // Get all report photo_ids associated with the report
    $sql = "SELECT p.id AS id
              FROM report_trip_body rtb
                JOIN report_photo rp ON(rtb.report_photo_id = rp.id)
                JOIN photo p ON(rp.photo_id = p.id)
              WHERE report_trip_id = :reportTripId";
    $query = $database -> prepare($sql);
    $query -> execute([':reportTripId' => $report -> id]);
    $photos = $query -> fetchAll();

    // For each photo id
    foreach($photos as $photo){
      if (!isset($photo -> id)) continue;

      // Get piwigo id
      $sql = "SELECT id_piwigo
                  FROM photo
                  WHERE id = :id";
      $query = $database -> prepare($sql);
      $query -> execute([':id' => $photo -> id]);
      $result = $query -> fetch();

      $piwigoId = isset($result -> id_piwigo) ? $result -> id_piwigo : null;

      // For all photos with piwigo ids...
      $piwigoAlbumId = '';
      if (!empty($piwigoId)) {
        $databasePiwigo = Lib\MyPDOManager:: mysqlPdoObject(
          Config:: get('DB_PIWIGO_HOST'),
          Config:: get('DB_PIWIGO_USER'),
          Config:: get('DB_PIWIGO_PASS'),
          Config:: get('DB_PIWIGO_NAME'),
          Lib\MyPDOStatement:: getOptions());

        // Look up corresponding album ids
        $sql = "SELECT category_id
                      FROM piwigo_image_category
                      WHERE image_id = :imageId";
        $query = $databasePiwigo -> prepare($sql);
        $query -> execute([':imageId' => $piwigoId]);
        $piwigoAlbumId = $query -> fetch() -> category_id;
      }

      // Get album ID from piwigo album ID
      $albumId = '';
      if (!empty($piwigoAlbumId)) {
        $sql = "SELECT id
                      FROM photo_album
                      WHERE id_piwigo = :id";
        $query = $database -> prepare($sql);
        $query -> execute([':id' => $piwigoAlbumId]);
        $albumId = $query -> fetch() -> id;
      }

      // Set Album ID
      if (!empty($albumId)) {
        $sql = "UPDATE photo
                      SET album_id = : album_id
                      WHERE id = :id";
        $query = $database -> prepare($sql);
        $query -> execute([
          ':album_id' => $albumId,
          ':id' => $photo -> id
        ]);
      }
    }
  }
}

public static function associatePiwigoAlbumsToReportsByPhotos() {
  $database = DatabaseFactory:: getFactory() -> getConnection();

  $sql = "SELECT id
          FROM report_trip";
  $query = $database -> prepare($sql);
  $query -> execute();
  $reports = $query -> fetchAll();

  // For each trip report
  foreach($reports as $report){
    if (!isset($report -> id)) continue;
    // Get all report photo_ids associated with the report
    $sql = "SELECT p.id AS id
              FROM report_trip_body rtb
                JOIN report_photo rp ON(rtb.report_photo_id = rp.id)
                JOIN photo p ON(rp.photo_id = p.id)
              WHERE report_trip_id = :reportTripId";
    $query = $database -> prepare($sql);
    $query -> execute([':reportTripId' => $report -> id]);
    $photos = $query -> fetchAll();

    $piwigoAlbums = [];
    $piwigoAlbumIds = [];

    // For each photo id
    foreach($photos as $photo){
      if (!isset($photo -> id)) continue;

      // Get piwigo id
      $sql = "SELECT id_piwigo
                  FROM photo
                  WHERE id = :id";
      $query = $database -> prepare($sql);
      $query -> execute([':id' => $photo -> id]);
      $result = $query -> fetch();

      $piwigoId = isset($result -> id_piwigo) ? $result -> id_piwigo : null;

      // For all photos with piwigo ids...
      if (!empty($piwigoId)) {
        $databasePiwigo = Lib\MyPDOManager:: mysqlPdoObject(
          Config:: get('DB_PIWIGO_HOST'),
          Config:: get('DB_PIWIGO_USER'),
          Config:: get('DB_PIWIGO_PASS'),
          Config:: get('DB_PIWIGO_NAME'),
          Lib\MyPDOStatement:: getOptions());

        // Look up corresponding album ids
        $sql = "SELECT category_id
                      FROM piwigo_image_category
                      WHERE image_id = :imageId";
        $query = $databasePiwigo -> prepare($sql);
        $query -> execute([':imageId' => $piwigoId]);
        $piwigoAlbumId = $query -> fetch() -> category_id;

        // Get piwigo album id if unique, and piwigo url, piwigo title
        if ($piwigoAlbumId && !in_array($piwigoAlbumId, $piwigoAlbumIds)) {
          $piwigoAlbumIds[] = $piwigoAlbumId;

          $piwigoAlbum = new \stdClass();
          $piwigoAlbum -> url = AlbumModel:: piwigoCategoryUrlStub.$piwigoAlbumId;
          $piwigoAlbum -> url_piwigo = $piwigoAlbum -> url;
          $piwigoAlbum -> id_piwigo = $piwigoAlbumId;

          $sql = "SELECT name
                          FROM piwigo_categories
                          WHERE id = :albumId";
          $query = $databasePiwigo -> prepare($sql);
          $query -> execute([':albumId' => $piwigoAlbumId]);
          $piwigoAlbum -> title = $query -> fetch() -> name;

          $piwigoAlbums[] = $piwigoAlbum;
        }
      }
    }

    // For each album id:
    foreach($piwigoAlbums as $piwigoAlbum){
      // Add new album reference
      $album = new Db\Album($piwigoAlbum);

      try {
        $database -> beginTransaction();

        $albumId = AlbumModel:: addAlbum($album);
        Lib\MyPDOManager:: confirmTransaction($albumId);

        $result = self:: addAlbumRelation($report -> id, $albumId);
        Lib\MyPDOManager:: confirmTransaction($result);

        $database -> commit();
      } catch (\Exception $e) {
        $database -> rollback();
        Lib\MyLogger:: log('Error No: '.$e -> getCode(). ' - '.$e -> getMessage(). '<br />');
        Lib\MyLogger:: log(nl2br($e -> getTraceAsString()));
        Session:: add('feedback_negative', Text:: get('FEEDBACK_REPORT_CREATION_FAILED'));
        return false;
      }
    }
  }
  return true;
}