function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${className}`}>{status}</span>;
}

export default StatusBadge;
