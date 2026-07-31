import { gql } from "@apollo/client";

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on CategoryModel {
    id
    title
    description
    icon
    color
    transactionsCount
    totalAmount
  }
`;

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on TransactionModel {
    id
    description
    amount
    type
    date
    categoryId
    category {
      id
      title
      icon
      color
    }
  }
`;
