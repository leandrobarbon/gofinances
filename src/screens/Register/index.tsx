import { useState } from "react";
import { Modal } from "react-native";

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from "./styles";

import { Button } from "../../components/Forms/Button";
import { Input } from "../../components/Forms/Input/input";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";

export function Register() {
  const [TransactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
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

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>


      <Form>
        <Fields>
          <Input
            placeholder="Nome"
          />

          <Input
            placeholder="Preco"
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
  )
}