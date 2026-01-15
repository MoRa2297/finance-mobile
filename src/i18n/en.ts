const it = {
  // common: {
  //   retry: 'Riprova',
  //   welcome: 'Benvenuto',
  //   continue: 'Continua',
  //   confirm: 'Conferma',
  //   send: 'Invia',
  //   support: 'Supporto',
  //   login: 'Accedi',
  //   loading: 'Caricamento in corso...',
  //   payTheInstallment: 'Paga il bollettino',
  //   or: 'or',
  // },
  components: {
    bottomNavigator: {
      home: 'Home',
      transaction: 'Transaction',
      budgets: 'Budgets',
      more: 'More',
    },
  },
  screens: {
    loginScreen: {
      welcome: 'Benvenuto in Nims',
      welcomeSub: 'Benvenuto in Nims',
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Password',
      forgotPassword: 'Password dimenticata?',
    },
    homeScreen: {},
  },
  messages: {
    formValidations: {
      general: {
        required: 'Campo richiesto',
        emailNotValid: 'E-mail non valida',
        min7: 'Password troppo corta, deve essere di minimo 7 caratteri',
        lowercaseLetter: 'Deve esserci almeno una lettera minuscola',
        uppercaseLetter: 'Deve esserci almeno una lettera maiuscola',
        symbol: 'Deve esserci almeno un simbolo',
        number: 'Deve esserci almeno un numero',
      },
    },
    apiErrors: {
      genericError: 'Si è verificato un errore',
      unauthorizedError: 'Non sei autorizzato',
      tryAgainError: 'Riprova o contatta il nostro supporto',
    },
  },
};

export type I18NStrings = typeof it;

export default it;
