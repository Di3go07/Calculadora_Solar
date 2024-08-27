import streamlit as st 
import math

#APRESENTAÇÃO
st.title ('Projeto Interdisciplinar')
st.header ('Economias com energia solar')

#INVESTIMENTO
st.subheader('Dados Gerais')
valor = st.number_input("Valor pago por mês na conta de luz", value=0.00)
novo_valor = int(valor) * 0.05
economia = int(valor) - float(novo_valor)
economia_ano = economia * 12
st.markdown (f'Após a instalação, sua conta de luz seria de R${novo_valor} por mês')
st.markdown (f'Você economizaria R${float(economia)} por mês')
st.markdown (f'Você economizaria R${float(economia_ano)} por ano')


#PRODUÇÃO PAINEIS SOLARES
painel = 330 #W/dia
energia_dia = painel * 4.5 * 0.8 #potencia * irradiação * uso (kHw/dia)
enegia_mes = energia_dia * 30 / 1000 #kHw/mes

#INSTALAÇÃO
st.subheader('Instalação')
valor_KwH = st.number_input("Valor gasto por mês em kWh, em média", value=0)
st.markdown(f"Uma placa solar de 330W produz {enegia_mes:.2f}kWh/mês")
quantidade_placa = valor_KwH//enegia_mes + 1
st.markdown(f"Serão necessárias {int(quantidade_placa)} placas solares")

#RETORNO
st.subheader('Retorno')
kWh_dia = valor_KwH // 30
gerador = kWh_dia // 4.5 + 1 #gasto diario pela incidencia de sol (kWp)
st.markdown(f"Seu sistema necessitara de geradores com {int(gerador)}kWp")
if valor != 0 and valor_KwH != 0:
    if gerador <= 2:
        st.markdown(f"O investimento ficaria em torno de R$7.740,00")
        custo = 7740
        retorno_ano = custo// int(economia_ano)
        st.markdown(f"Levariam {retorno_ano} anos para pagar os custos do investimento com as economias da instalação")
    if gerador > 2 and gerador <= 4:
        st.markdown(f"O investimento ficaria em torno de R$12.680,00")
        custo = 12680
        retorno_ano = custo// int(economia_ano)
        st.markdown(f"Levariam {retorno_ano} anos para pagar os custos do investimento com as economias da instalação")
    if gerador > 4 and gerador <= 8:
        st.markdown(f"O investimento ficaria em torno de R$21.360,00")
        custo = 21360
        retorno_ano = custo// int(economia_ano)
        st.markdown(f"Levariam {retorno_ano} anos para pagar os custos do investimento com as economias da instalação")
else:
    st.markdown('Preencha todos os campos acima!')

