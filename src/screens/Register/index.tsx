import { useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from "./styles";

import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Forms/InputForm";

interface FormData {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome e obrigatorio'),
  amount: Yup
    .number()
    .typeError('Informe um valor numerico')
    .positive('O valor nao pode ser negativo')
})

export function Register() {
  const [TransactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  function handleTransactionsTypeSelect(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleRegister(form: FormData) {
    if (!TransactionType)
      return Alert.alert('Selecione o tipo da transação')

    if (category.key === 'category')
      return Alert.alert('Selecione a categoria')

    const data = {
      name: form.name,
      amount: form.amount,
      TransactionType,
      category: category.key
    }

    console.log(data);

  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>


        <Form>
          <Fields>
            <InputForm
              name='name'
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors?.name.message}
            />

            <InputForm
              name='amount'
              control={control}
              placeholder="Preco"
              keyboardType="numeric"
              error={errors.amount && errors?.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionsTypeSelect('up')}
                isActive={TransactionType === 'up'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionsTypeSelect('down')}
                isActive={TransactionType === 'down'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}