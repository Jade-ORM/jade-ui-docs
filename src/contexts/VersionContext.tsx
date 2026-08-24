import { createContext, useContext, useState, type ReactNode } from "react";
import {
  versions,
  getVersion,
  getLatestVersion,
  type Version,
} from "../data/versions";

interface VersionContextType {
  currentVersion: Version;
  setVersion: (versionId: string) => void;
  availableVersions: Version[];
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
  const [currentVersion, setCurrentVersion] =
    useState<Version>(getLatestVersion());

  const setVersion = (versionId: string) => {
    const version = getVersion(versionId);
    if (version) {
      setCurrentVersion(version);
    }
  };

  return (
    <VersionContext.Provider
      value={{ currentVersion, setVersion, availableVersions: versions }}
    >
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (!context)
    throw new Error("useVersion must be used within VersionProvider");
  return context;
}
