/**
     * Creates a new trip report header.
     * @param Db\ReportTrip $header Trip report header object containing the data to be inserted.
     * @param bool $returnExisting True: If the trip report already exists (based on url), the existing trip report ID is returned. Otherwise an error occurs.
     * @return bool|int The ID of the created trip report, or either the ID of an existing trip report or false if the trip report already exists.
     */
public static function createTripReportHeader(Db\ReportTrip $header, $returnExisting = true) {
    $database = DatabaseFactory:: getFactory() -> getConnection();

    // If one already exists, return the id.
    if ($result = self:: isExisting($header -> getPage() -> getId())) {
        if ($returnExisting) {
            return $result;
        }
        Session:: add('feedback_negative', Text:: get('FEEDBACK_REPORT_ALREADY_EXISTS'));
        return false;
    }

    // Otherwise, add the report
    $sql = "INSERT INTO report_trip (
    page_id,
        status_id,
        report_trip_type_id)
    VALUES(
              : page_id,
              : status_id,
              : report_trip_type_id)";
    $query = $database -> prepare($sql);
    $query -> execute([
        ':page_id' => $header -> getPage() -> getId(),
        ':status_id' => $header -> getStatusId(),
        ':report_trip_type_id' => $header -> getReportTypeId()
    ]);
    $reportId = ($query -> rowCount() === 1) ? (int)$database -> lastInsertId() : false;
    Lib\MyLogger:: log('Report ID: '.$reportId. '<br />');

    if (!empty($reportId) && empty($header -> getId())) {
        $header -> setId($reportId);
    }

    return $reportId;
}

/**
* Adds the current trip report body sequence to the trip report body set.
* @param Db\ReportTripBody $body
* @return null
*/
public static function addTripReportBody(Db\ReportTripBody $body) {
    if (!self:: insertTripReportBody($body)) {
        return null;
    }

    $database = DatabaseFactory:: getFactory() -> getConnection();

    $sql = "INSERT INTO report_trip_body (
    report_trip_id,
        sequence,
        header_type_id,
        header_value,
        report_photo_id,
        report_video_id,
        text_body)
    VALUES(
                  : report_trip_id,
                  : sequence,
                  : header_type_id,
                  : header_value,
                  : report_photo_id,
                  : report_video_id,
                  : text_body)";
    $query = $database -> prepare($sql);
    $query -> execute([
        ':report_trip_id' => $body -> report_trip_id,
        ':sequence' => $body -> sequence,
        ':header_type_id' => $body -> getHeader() -> getHeaderTypeId(),
        ':header_value' => empty($body -> getHeader() -> header_value) ? null : $body -> getHeader() -> header_value,
        ':report_photo_id' => $body -> getReportPhoto() -> getId(),
        ':report_video_id' => $body -> getReportVideo() -> getId(),
        ':text_body' => empty($body -> text_body) ? null : $body -> text_body]);
    return ($query -> rowCount() === 1) ? (int)$database -> lastInsertId() : false;
}

/**
* Adds an n:m relation between the report and photo album.
* @param $reportId
* @param $albumId
* @return bool
*/
public static function addAlbumRelation($reportId, $albumId) {
    $database = DatabaseFactory:: getFactory() -> getConnection();

    $values = [
        ':reportId' => $reportId,
        ':albumId' => $albumId
    ];

    $sql = "SELECT report_trip_id
            FROM report_trip_has_photo_album
            WHERE report_trip_id = : reportId
            AND photo_album_id = :albumId";
    $query = $database -> prepare($sql);
    $query -> execute($values);
    if ($query -> rowCount() === 1) {
        return true;
    } else {
        $sql = "INSERT INTO report_trip_has_photo_album (
        report_trip_id,
            photo_album_id)
        VALUES(
                              : reportId,
                              : albumId)";
        $query = $database -> prepare($sql);
        $query -> execute($values);
        return ($query -> rowCount() === 1);
    }
}

/**
* Adds an n:m relation between the report and reference.
* @param $reportId
* @param $referenceId
* @return bool
*/
public static function addReferenceRelation($reportId, $referenceId) {
    $database = DatabaseFactory:: getFactory() -> getConnection();

    $values = [
        ':reportId' => $reportId,
        ':referenceId' => $referenceId
    ];

    $sql = "SELECT report_trip_id
            FROM report_trip_has_reference
            WHERE report_trip_id = : reportId
            AND reference_id = :referenceId";
    $query = $database -> prepare($sql);
    $query -> execute($values);
    if ($query -> rowCount() === 1) { // Relations do not return unique IDs.
        return false;
    } else {
        $sql = "INSERT INTO report_trip_has_reference (
        report_trip_id,
            reference_id)
        VALUES(
                      : reportId,
                      : referenceId)";
        $query = $database -> prepare($sql);
        $query -> execute($values);
        return ($query -> rowCount() === 1) ? true : false;
    }
}


/**
* Writes the trip report JSON object to the database.
* @param $data
* @return bool  True: The report was successfully created.
*/
public static function createReportFromJson($data) {
    $report = Lib\JsonHandler:: decode($data, $assoc = true);
    $report = Report:: factoryStdClass($report);
    return self:: createTripReport($report);
}

/**
* Writes the trip report object to the database.
* @param Report $report
* @return bool  True: The report was successfully created.
*/
public static function createTripReport(Report $report) {
    $database = DatabaseFactory:: getFactory() -> getConnection();

    try {
        $database -> beginTransaction();

        // 1. Insert Data to page
        $pageId = PageModel:: createPage($report -> getHeader() -> getPage());
        Lib\MyPDOManager:: confirmTransaction($pageId);

        // 2. Insert data to report_trip

        // 2b. Insert data
        $reportId = self:: createTripReportHeader($report -> getHeader());
        Lib\MyPDOManager:: confirmTransaction($reportId);

        // 3. Insert data to report_trip_body
        for ($i = 0; $i < $report -> getMaxSequence(); $i++) {
            $reportBody = $report -> getBody($i);
            if (empty($reportBody -> report_trip_id)) {
                $reportBody -> report_trip_id = $reportId;
            }

            Lib\MyLogger:: log('___________________________<br />');
            Lib\MyLogger:: log('Sequence '.$reportBody -> sequence. '<br />');
            Lib\MyLogger:: log('---------------------------<br />');

            // 3b. Add photo
            if (!empty($reportBody -> getReportPhoto() -> getPhoto() -> url)) {
                $photoId = PhotoModel:: addPhoto($reportBody -> getReportPhoto() -> getPhoto());
                Lib\MyPDOManager:: confirmTransaction($photoId);

                $reportPhotoId = PhotoModel:: addReportPhoto($reportBody -> getReportPhoto());
                Lib\MyPDOManager:: confirmTransaction($reportPhotoId);
            }

            // 3c. Add video
            if (!empty($reportBody -> getReportVideo() -> getVideo() -> url)) {
                $videoId = VideoModel:: addVideo($reportBody -> getReportVideo() -> getVideo());
                Lib\MyPDOManager:: confirmTransaction($videoId);

                $reportVideoId = VideoModel:: addReportVideo($reportBody -> getReportVideo());
                Lib\MyPDOManager:: confirmTransaction($reportVideoId);
            }

            // Skip adding body if all relevant values are null
            if (!self:: insertTripReportBody($reportBody)) continue;

            $reportTextBodyId = self:: addTripReportBody($reportBody);
            Lib\MyPDOManager:: confirmTransaction($reportTextBodyId);
        }

        // 4. Add photo albums
        for ($i = 0; $i < $report -> countAlbums(); $i++) {
            $albumId = AlbumModel:: addAlbum($report -> getAlbum($i));
            Lib\MyPDOManager:: confirmTransaction($albumId);

            $result = self:: addAlbumRelation($reportId, $albumId);
            Lib\MyPDOManager:: confirmTransaction($result);
        }

        // 5. Add links
        for ($i = 0; $i < $report -> countReferenceLinkExternal(); $i++) {
            $referenceId = ReferenceModel:: addReference($report -> getReferenceLinkExternal($i));
            Lib\MyPDOManager:: confirmTransaction($referenceId);

            $result = self:: addReferenceRelation($reportId, $referenceId);
            Lib\MyPDOManager:: confirmTransaction($result);
        }

        for ($i = 0; $i < $report -> countReferenceLinkInternal(); $i++) {
            $referenceId = ReferenceModel:: addReference($report -> getReferenceLinkInternal($i));
            Lib\MyPDOManager:: confirmTransaction($referenceId);

            $result = self:: addReferenceRelation($reportId, $referenceId);
            Lib\MyPDOManager:: confirmTransaction($result);
        }

        for ($i = 0; $i < $report -> countReference(); $i++) {
            $referenceId = ReferenceModel:: addReference($report -> getReference($i));
            Lib\MyPDOManager:: confirmTransaction($referenceId);

            $result = self:: addReferenceRelation($reportId, $referenceId);
            Lib\MyPDOManager:: confirmTransaction($result);
        }

        $database -> commit();
    } catch (\Exception $e) {
        $database -> rollback();
        Lib\MyLogger:: log('Error No: '.$e -> getCode(). ' - '.$e -> getMessage(). '<br />');
        Lib\MyLogger:: log(nl2br($e -> getTraceAsString()));
        Session:: add('feedback_negative', Text:: get('FEEDBACK_REPORT_CREATION_FAILED'));
        return false;
    }
    Session:: add('feedback_positive',
        Text:: get('FEEDBACK_REPORT_SUCCESSFULLY_CREATED').
          ' Report_ID: '.$report -> getHeader() -> getId().
          ' ~ Name: '.$report -> getHeader() -> getPage() -> title_full.
          ' ~ URL: '.$report -> getHeader() -> getPage() -> url);
    return true;
}


/**
* Only insert if at least one of the critical data is not null.
* @param Db\ReportTripBody $body
* @return bool True: The body object should be added.
*/
public static function insertTripReportBody(Db\ReportTripBody $body) {
    return !($body -> getHeader() -> getHeaderTypeId() === null &&
        $body -> getHeader() -> header_value === null &&
        $body -> getReportPhoto() -> getId() === null &&
        $body -> getReportVideo() -> getId() === null &&
        $body -> text_body === null);
}