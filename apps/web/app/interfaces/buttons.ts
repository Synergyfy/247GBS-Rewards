import React from 'react';

export interface ISolidButton {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IOutlineButton {
  color: string;
  children: React.ReactNode;
}

export interface IRegisterButton {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
