import { useCallback, useEffect, useState } from "react";
import { View } from 'react-native';
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "styled-components";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  LogoutButton,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer
} from "./styles";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionsCard, TransactionsCardProps } from "../../components/TransactionsCard";
import { LastTransaction } from './../../components/HighlightCard/styles';
export interface DataListProps extends TransactionsCardProps {
  id: string;
}
interface HighlightProps {
  amount: string;
  LastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps,
  expensive: HighlightProps,
  total: HighlightProps
}


export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactios] = useState<DataListProps[]>([])
  const [highlightData, setHightlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionsDate(
    collections: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const LastTransaction = new Date(
      Math.max.apply(Math, collections
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())))

    return `${LastTransaction.getDate()} de ${LastTransaction.toLocaleString('pt-BR', {
      month: 'long'
    })}`
  }

  async function loadTrasactions() {
    const dataKey = '@gofinance:transactions';
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesTotal += Number(item.amount)
        } else {
          expensiveTotal += Number(item.amount)
        }


        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }
      });

    setTransactios(transactionsFormatted);

    const LastTransactionEntries = getLastTransactionsDate(transactions, 'positive');
    const LastTransactionExpensives = getLastTransactionsDate(transactions, 'negative');
    const totalInterval = `01 à ${LastTransactionExpensives}`


    const total = entriesTotal - expensiveTotal;

    setHightlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        LastTransaction: `Última entrada dia ${LastTransactionEntries}`,
      },
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        LastTransaction: `Última saída dia ${LastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        LastTransaction: totalInterval
      }
    })

    setIsLoading(false);
  }

  useEffect(() => {
    loadTrasactions();
  }, [])

  useFocusEffect(useCallback(() => {
    loadTrasactions();
  }, []));

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: `https://avatars.githubusercontent.com/u/11528359?v=4` }} />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>Leandro</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={() => { }}>
                  <Icon name='power' />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData?.entries?.amount}
                lastTransaction={highlightData.entries.LastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData?.expensive?.amount}
                lastTransaction={highlightData.expensive.LastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData?.total?.amount}
                lastTransaction={highlightData.total.LastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionsCard data={item} />}
                ItemSeparatorComponent={() => <View style={{ marginBottom: 16 }} />}
              />

            </Transactions>
          </>
      }
    </Container>
  )
}