import { gql } from "@apollo/client";
import { CATEGORY_FIELDS } from "../fragments";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
