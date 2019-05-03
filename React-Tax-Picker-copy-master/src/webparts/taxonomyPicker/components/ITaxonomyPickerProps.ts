import { WebPartContext } from "@microsoft/sp-webpart-base";


export interface ITaxonomyPickerProps {
  description: string;
  WebpartName: string;
  TermStoreApplication: string;
  TermSetName: string;
  myContext: WebPartContext
}
