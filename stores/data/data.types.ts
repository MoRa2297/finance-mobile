import {
    BankAccount,
    BankAccountType,
    BankCard,
    BankType,
    CardType,
    Category,
    CategoryIcon,
    Color,
    EditBankAccount,
    EditBankCard,
    EditCategory,
    EditTransaction,
    Transaction,
} from '../../types/types';

export interface DataState {
    hasBeenInitiated: boolean;
    colors: Color[];
    categoryIcon: CategoryIcon[];
    categories: Category[];
    bankTypes: BankType[];
    bankAccountType: BankAccountType[];
    bankAccount: BankAccount[];
    cardTypes: CardType[];
    bankCard: BankCard[];
    transactions: Transaction[];
}

export interface DataActions {
    // Setters
    setColors: (colors: Color[]) => void;
    setCategoryIcon: (categoryIcon: CategoryIcon[]) => void;
    setCategories: (categories: Category[]) => void;
    setBankType: (bankTypes: BankType[]) => void;
    setBankAccountType: (bankAccountType: BankAccountType[]) => void;
    setBankAccount: (bankAccount: BankAccount[]) => void;
    setCardTypes: (cardTypes: CardType[]) => void;
    setBankCard: (bankCard: BankCard[]) => void;
    setTransaction: (transactions: Transaction[]) => void;
    setHasBeenInitiated: (hasBeenInitiated: boolean) => void;

    // Init
    init: (sessionToken: string, userId: number) => Promise<void>;

    // Colors & Icons
    getColors: (sessionToken: string) => Promise<void>;
    getCategoryIcons: (sessionToken: string) => Promise<void>;

    // Bank Types
    getBankTypes: (sessionToken: string) => Promise<void>;
    getBankAccountTypes: (sessionToken: string) => Promise<void>;
    getCardTypes: (sessionToken: string) => Promise<void>;

    // Categories
    getCategories: (sessionToken: string, userId: string) => Promise<void>;
    createCategory: (sessionToken: string, category: EditCategory) => Promise<void>;
    updateCategory: (sessionToken: string, category: EditCategory) => Promise<void>;
    deleteCategory: (sessionToken: string, categoryId: string) => Promise<void>;

    // Bank Accounts
    getBankAccounts: (sessionToken: string, userId: string) => Promise<void>;
    createBankAccount: (sessionToken: string, bankAccount: EditBankAccount) => Promise<void>;
    updateBankAccount: (sessionToken: string, bankAccount: EditBankAccount) => Promise<void>;
    deleteBankAccount: (sessionToken: string, bankAccountId: string) => Promise<void>;

    // Bank Cards
    getBankCard: (sessionToken: string, userId: string) => Promise<void>;
    createBankCard: (sessionToken: string, bankCard: EditBankCard) => Promise<void>;
    updateBankCard: (sessionToken: string, bankCard: EditBankCard) => Promise<void>;
    deleteBankCard: (sessionToken: string, bankCardId: string) => Promise<void>;

    // Transactions
    getTransactions: (sessionToken: string, userId: string) => Promise<void>;
    createTransaction: (sessionToken: string, transaction: EditTransaction) => Promise<void>;
    updateTransaction: (sessionToken: string, transaction: EditTransaction) => Promise<void>;
    deleteTransaction: (sessionToken: string, transactionId: string) => Promise<void>;

    // Reset
    reset: () => void;
}

export type DataStore = DataState & DataActions;
