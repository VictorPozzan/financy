import { gql } from "@apollo/client";
import { CATEGORY_FIELDS } from "../fragments";

export const LIST_CATEGORIES = gql`
  query ListCategories {
    listCategories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;
