import React from 'react';
import { Link } from 'react-router-dom'

import logo from '~/assets/logo.svg'

// import { Container } from './styles';

export default function SignUp() {
  return (
    <>
      <img src={logo} alt="GoBarber"></img>

      <form>
        <input type="text" placeholder="Nome Completo"></input>
        <input type="email" placeholder="Seu e-mail"></input>
        <input type="password" placeholder="Sua senha secreta"></input>
        <button type="submit">Criar Conta</button>
        <Link to="/">Já tenho login</Link>
      </form>
    </>

  );
}
