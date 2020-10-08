import {
  Unpack,
  arrayOf,
  boolean,
  number,
  objectOf,
  optional,
  record,
  string
} from 'wdk-client/Utils/Json';

const publicStrategy = record({
  lastViewed: string,
  rootStepId: number,
  signature: string,
  author: string,
  releaseVersion: string,
  isValid: boolean,
  description: string,
  leafAndTransformStepCount: number,
  isDeleted: boolean,
  estimatedSize: optional(number),
  isSaved: boolean,
  isExample: boolean,
  organization: string,
  name: string,
  recordClassName: string,
  createdTime: string,
  isPublic: boolean,
  strategyId: number,
  lastModified: string,
  nameOfFirstStep: string
});

export const publicStrategyResponse = arrayOf(publicStrategy);

export type PublicStrategyResponse = Unpack<typeof publicStrategyResponse>;

const studyAccessResults = record({
  totalCount: number,
  publicStrats: arrayOf(publicStrategy)
});
export const studyAccessResponse = record({
  validCounts: optional(objectOf(number)),
  rowsResults: studyAccessResults
});
export type StudyAccessResponse = Unpack<typeof studyAccessResponse>;

export interface StudyAccessRequest {
  searchText: string;
  restrictToProject?: string;
}

// API  defined in https://veupathdb.github.io/service-dataset-access/api.html#type:lib.DatastoreId
const datastoreId = number;

export type DatastoreId = Unpack<typeof datastoreId>;

const userDetails = record({
  userId: number,
  firstName: string,
  lastName: string,
  organization: string
});

export type UserDetails = Unpack<typeof userDetails>;

const staff = record({
  staffId: datastoreId,
  user: userDetails,
  isOwner: boolean
});

export type Staff = Unpack<typeof staff>;

const staffList = record({
  data: arrayOf(staff),
  rows: number,
  offset: number,
  total: number
});

export type StaffList = Unpack<typeof staffList>;
