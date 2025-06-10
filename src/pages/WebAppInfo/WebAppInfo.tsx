import React, { useEffect, useState } from "react";
import packageJSON from "../../../package.json";

type VersionInfo = {
  appVersion: string;
  buildDate: string;
  frontend: string;
  backend: string;
  database: string;
  authMethod: string;
  environment: string;
  gitCommit: string;
  contact: string;
};

const WebAppInfo: React.FC = () => {
  const [info, setInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch("/version.json")
      .then((res) => res.json())
      .then(setInfo)
      .catch((err) => console.error("Failed to load version info:", err));
  }, []);

  if (!info) return <p>Loading system info...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🌐 Software Information
      </h1>
      <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="p-3 text-left w-44">Label</th>
            <th className="p-3 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <InfoRow label="App Version" value={packageJSON.version} />
          <InfoRow label="Build Date" value={info.buildDate} />
          <InfoRow label="Environment" value={info.environment} />
          <InfoRow label="Frontend" value={info.frontend} />
          <InfoRow label="Backend" value={info.backend} />
          <InfoRow label="Database" value={info.database} />
          <InfoRow label="Authentication" value={info.authMethod} />
          {/* เปิดใช้ถ้าต้องการ */}
          {/* <InfoRow label="Git Commit" value={info.gitCommit} copyable /> */}
          <InfoRow label="Contact" value={info.contact} />
        </tbody>
      </table>
    </div>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
  copyable?: boolean;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, copyable }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <tr className="border-t even:bg-gray-50">
      <td className="p-3 font-medium bg-gray-100 w-44">{label}</td>
      <td className="p-3 flex items-center gap-3">
        <span className="break-all">{value}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none"
            aria-label={`Copy ${label}`}
            title="Copy to clipboard"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </td>
    </tr>
  );
};

export default WebAppInfo;
