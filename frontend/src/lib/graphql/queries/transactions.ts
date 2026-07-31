import { gql } from "@apollo/client";
import { TRANSACTION_FIELDS } from "../fragments";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($filters: TransactionFiltersInput) {
    listTransactions(filters: $filters) {
      total
      page
      pageSize
      items {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DASHBOARD_SUMMARY = gql`
  query DashboardSummary {
    dashboardSummary {
      balance
      monthlyIncome
      monthlyExpenses
      recentTransactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;
