import React, { useEffect, useRef, useState } from 'react';
import { useMountedState } from '../commons/hooks/use-mounted-state';
import { axios } from '../providers/axios';
import { CopyToClipboard } from '../commons/components/CopyToClipboard';

interface ApiInfo {
  version: string;
  buildDate: Date;
  commitHash: string;
}

function useApiInfo() {
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState();
  const [apiInfo, setApiInfo] = useState<ApiInfo>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<ApiInfo>(`/system/info`)
      .then(({ data }) => data)
      .then(setApiInfo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading]);

  return {
    apiInfo,
    error,
    loading,
  };
}

function getMarkdown(data) {
  return `\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``;
}

export function BuildInfo({ className }: {
  className?;
}) {
  const { apiInfo } = useApiInfo();

  const jsonRef = useRef({
    ui: {
      version: process.env.REACT_APP_VERSION,
      commitHash: process.env.REACT_APP_BUILD_DATE,
      buildDate: process.env.REACT_APP_BUILD_DATE,
    },
    api: undefined,
  });

  const [json, setJson] = useState(getMarkdown(jsonRef.current));

  useEffect(() => {
    if (apiInfo) {
      jsonRef.current.api = apiInfo;
    }
    setJson(getMarkdown(jsonRef.current));
  }, [apiInfo]);

  return (
    <>
      <CopyToClipboard
        className={className}
        value={json}
      >
        {apiInfo?.version || process.env.REACT_APP_VERSION}
      </CopyToClipboard>
    </>
  );
}
