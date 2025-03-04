export type FuseRecord = {
  id: string;
  attributes: {
    [key: string]: string | string[] | undefined;
  };
};
