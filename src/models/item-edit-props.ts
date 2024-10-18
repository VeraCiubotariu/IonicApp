import { RouteComponentProps } from "react-router";

export default interface ItemEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}
