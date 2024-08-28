import streamlit as st 
import math

#ESTRUTURA
st.set_page_config(
    layout="wide",
    page_title="Calculadora Solar", 
    page_icon="☀️"
)
col1, col2 = st.columns(2, gap='large')
with open("style.css", encoding="utf8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

#SIDEBAR 
with st.container():
    st.sidebar.header('Trabalho Interdisciplinar')
    st.sidebar.subheader('Iluminando o Futuro')
st.sidebar.divider()
with st.container():
    st.sidebar.subheader('Apresentação')
    st.sidebar.markdown("O programa tem como objetivo conscientizar as pessoas sobre as econômias que seriam feitas caso ela investisse em energia solar.")
st.sidebar.divider()
with st.container():
    st.sidebar.subheader('Processamento')
    st.sidebar.markdown("As base para os cálculos realizados são a conta de luz da pessoa, o preço médio de geradores fotovoltaicos e a instalação de placas solares de 330W.")
st.sidebar.divider()
with st.container():
    st.sidebar.subheader('Sobre')
    st.sidebar.markdown('2° ano - Grupo 4')
    with st.sidebar.popover("Alunos"):
        st.markdown("Ana Luiza Vieira Aleixo")
        st.markdown("Antônio Tomaz Pereira Bertoldo")
        st.markdown("Arthur Rosa Lobo Dias")
        st.markdown("Diego Penna Andrade Barros")
        st.markdown("Jordana Coelho Moreira de Souza")
        st.markdown("Luana Ferreira Alves")
        st.markdown("Sofia Lage Sá")
    with st.sidebar.popover("Fontes"):
            st.markdown("https://www.portalsolar.com.br/quanto-custa-para-instalar-energia-solar.html")
            st.markdown("https://www.portalsolar.com.br/gerador-de-energia-solar.html")
            st.markdown("https://blog.solfacil.com.br/energia-solar/como-calcular-o-kwp-de-um-sistema-fotovoltaico/")

#APRESENTAÇÃO
with col1:
    st.title (''':orange[Economias com energia solar]''')

#INVESTIMENTO
with col1:
    with st.container():
        st.subheader('Dados Gerais')
        valor = st.number_input("Valor pago por mês na conta de luz", value=0.00)
        novo_valor = int(valor) * 0.05
        economia = int(valor) - float(novo_valor)
        economia_ano = economia * 12
        st.markdown (f'Após a instalação, sua conta de luz seria de R${novo_valor:.2f} por mês')
        st.markdown (f'Você economizaria R${float(economia):.2f} por mês')
        st.markdown (f'Você economizaria R${float(economia_ano):.2f} por ano')


#PRODUÇÃO PAINEIS SOLARES
painel = 330 #W/dia
energia_dia = painel * 4.5 * 0.8 #potencia * irradiação * uso (kHw/dia)
enegia_mes = energia_dia * 30 / 1000 #kHw/mes

#INSTALAÇÃO
with col1:
    with st.container():
        st.subheader('Instalação')
        valor_KwH = st.number_input("Valor gasto por mês em kWh, em média", value=0)
        st.markdown(f"Uma placa solar de 330W produz {enegia_mes:.2f}kWh/mês")
        quantidade_placa = valor_KwH//enegia_mes + 1
        st.markdown(f"Seriam necessárias {int(quantidade_placa)} placas solares")

#RETORNO
with col1:
    with st.container():
        if valor != 0 and valor_KwH != 0:
            st.subheader('Retorno')
            kWh_dia = valor_KwH // 30
            gerador = kWh_dia // 4.5 + 1 #gasto diario pela incidencia de sol (kWp)
            st.markdown(f"Seu sistema necessitara de geradores com {int(gerador)}kWp")
            if gerador <= 2:
                st.markdown(f"O investimento ficaria em torno de R$7.740,00")
                custo = 7740
                retorno_ano = custo// int(economia_ano)
                st.markdown(f"Levariam {retorno_ano + 1} anos para pagar os custos do investimento com as economias da instalação")
            if gerador > 2 and gerador <= 4:
                st.markdown(f"O investimento ficaria em torno de R$12.680,00")
                custo = 12680
                retorno_ano = custo// int(economia_ano)
                st.markdown(f"Levariam {retorno_ano + 1} anos para pagar os custos do investimento com as economias da instalação")
            if gerador > 4 and gerador <= 8:
                st.markdown(f"O investimento ficaria em torno de R$21.360,00")
                custo = 21360
                retorno_ano = custo// int(economia_ano)
                st.markdown(f"Levariam {retorno_ano + 1} anos para pagar os custos do investimento com as economias da instalação")
        else:
            with st.container():
                st.markdown('''**Preencha todos os campos acima!**''')

