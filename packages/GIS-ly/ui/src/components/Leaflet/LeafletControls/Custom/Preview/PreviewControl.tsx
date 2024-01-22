export type PreviewControlProps = {
  cbAccept: () => void;
  cbReject: () => void;
}

export function PreviewControl({ cbAccept, cbReject }: PreviewControlProps) {
  return (
    <div className="preview-label">
      <input type="button" onClick={cbAccept} value="Accept" />
      <input type="button" onClick={cbReject} value="Reject" />
    </div>
  );
}