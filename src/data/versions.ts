import { docsSectionsV1_3, type DocSection } from "./docs-v1.3";
import { docsSectionsV1_0 } from "./docs-v1.0";
import { docsSectionsV1_1 } from "./docs-v1.1";
import { docsSectionsV1_2 } from "./docs-v1.2";
import { docsSectionsV1_4 } from "./docs-v1.4";
import { docsSectionsV1_5 } from "./docs-v1.5";
import { docsSectionsV1_6 } from "./docs-v1.6";

export interface Version {
  id: string;
  label: string;
  isLatest: boolean;
  sections: DocSection[];
}

export const versions: Version[] = [
  {
    id: "v1.0.0",
    label: "v1.0.*",
    isLatest: false,
    sections: docsSectionsV1_0,
  },
  {
    id: "v1.1.0",
    label: "v1.1.*",
    isLatest: false,
    sections: docsSectionsV1_1,
  },
  {
    id: "v1.2.0",
    label: "v1.2.*",
    isLatest: false,
    sections: docsSectionsV1_2,
  },
  {
    id: "v1.3.0",
    label: "v1.3.*",
    isLatest: false,
    sections: docsSectionsV1_3,
  },
  {
    id: "v1.4.0",
    label: "v1.4.*",
    isLatest: false,
    sections: docsSectionsV1_4,
  },
  {
    id: "v1.5.0",
    label: "v1.5.*",
    isLatest: false,
    sections: docsSectionsV1_5,
  },
  {
    id: "v1.6.0",
    label: "v1.6.*",
    isLatest: true,
    sections: docsSectionsV1_6,
  },
];

export function getVersion(versionId: string): Version | undefined {
  return versions.find((v) => v.id === versionId);
}

export function getLatestVersion(): Version {
  return versions.find((v) => v.isLatest) || versions[versions.length - 1];
}

export function getDefaultVersionId(): string {
  return getLatestVersion().id;
}
