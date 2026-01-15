export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: Date;
  sex: string;
  imageUrl: string;
  acceptedTerms: boolean;
  token: string;
  updateDate: Date;
  createdDate: Date;
};
