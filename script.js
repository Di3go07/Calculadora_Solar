//page elements
const valorContaInput = document.getElementById("valorConta");
const valorKwhInput = document.getElementById("valorKwh");

// render chart
let chartInstance = null;
function renderPaybackChart(dados, investimento) {
    const ctx = document.getElementById("paybackChart").getContext("2d");

    const labels = dados.map(d => `Ano ${d.ano}`);
    const values = dados.map(d => d.acumulado);

    // Encontrar o ponto de payback (quando o acumulado fica >= 0)
    const paybackIndex = dados.findIndex(d => d.acumulado >= 0);
    const paybackYear = paybackIndex !== -1 ? dados[paybackIndex].ano : null;

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                id: 'principal',
                label: "Retorno líquido (R$)",
                data: values,
                borderColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    
                    if (!chartArea) return '#ffd60a';
                    
                    const gradient = ctx.createLinearGradient(
                        0, chartArea.bottom, 0, chartArea.top
                    );
                    
                    gradient.addColorStop(0, '#ff4d4d');
                    gradient.addColorStop(0.1, '#ff6b35');
                    gradient.addColorStop(0.2, '#ffb347');
                    gradient.addColorStop(0.3, '#ffd700');
                    gradient.addColorStop(0.5, '#ffe066');
                    gradient.addColorStop(1, '#fff5cc');
                    
                    return gradient;
                },
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    
                    if (!chartArea) return 'rgba(255, 214, 10, 0.2)';
                    
                    const gradient = ctx.createLinearGradient(
                        0, chartArea.bottom, 0, chartArea.top
                    );
                    
                    gradient.addColorStop(0, 'rgba(255, 77, 77, 0.4)');
                    gradient.addColorStop(0.1, 'rgba(255, 107, 53, 0.3)');
                    gradient.addColorStop(0.2, 'rgba(255, 179, 71, 0.25)');
                    gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.35)');
                    gradient.addColorStop(0.5, 'rgba(255, 224, 102, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 245, 204, 0.6)');
                    
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: values.map(v => v < 0 ? '#ff4d4d' : '#ffd700'),
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: values.map((v, index) => {
                    if (paybackIndex !== -1 && index === paybackIndex) {
                        return 10;
                    }
                    return 6;
                }),
                pointHoverRadius: 12,
                pointHoverBorderWidth: 3,
                pointStyle: 'circle'
            },
            {
                id: 'linha_referencia',
                label: "Investimento pago",
                data: dados.map(() => 0),
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderDash: [6, 4],
                borderWidth: 1.5,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                tension: 0
            },
            {
                id: 'payback',
                label: "",
                data: dados.map((d, index) => 
                    index === paybackIndex ? d.acumulado : null
                ),
                pointBackgroundColor: '#00ff88',
                pointBorderColor: 'white',
                pointBorderWidth: 3,
                pointRadius: paybackIndex !== -1 ? 14 : 0,
                pointHoverRadius: 18,
                order: 10,
                hoverRadius: 18,
                hitRadius: 30,
                showLine: false
            },
            {
                id: 'investimento_inicial',
                label: "",
                data: dados.map((d, index) => 
                    index === 0 ? d.acumulado : null
                ),
                pointBackgroundColor: '#ff6b6b',
                pointBorderColor: 'white',
                pointBorderWidth: 3,
                pointRadius: 14,
                pointHoverRadius: 18,
                showLine: false,
                order: 10,
                hoverRadius: 18,
                hitRadius: 30
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        filter: function(legendItem, data) {
                            const datasetId = data.datasets[legendItem.datasetIndex].id;
                            return datasetId !== 'payback' && datasetId !== 'investimento_inicial';
                        }
                    },
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#ffd700',
                    borderWidth: 2,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(items) {
                            if (items.length > 0) {
                                const item = items[0];
                                if (item.dataset.id === 'payback') {
                                    return `🎯 Payback alcançado!`;
                                }
                                if (item.dataset.id === 'investimento_inicial') {
                                    return `📌 Investimento Inicial`;
                                }
                            }
                            return items[0]?.label || '';
                        },
                        label: function(context) {
                            const dataset = context.dataset;
                            const value = context.parsed.y;
                            const dataIndex = context.dataIndex;
                            
                            if (dataset.id === 'principal') {
                                if (dataIndex === 0) {
                                    return null;
                                }
                                const percentual = ((value / investimento) * 100).toFixed(1);
                                const sinal = value >= 0 ? '+' : '';
                                return ` Retorno: ${sinal}R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${percentual}% do investimento)`;
                            }
                            
                            if (dataset.id === 'payback' && value !== null) {
                                return [
                                    `🎯 Payback alcançado!`,
                                ];
                            }
                            
                            if (dataset.id === 'investimento_inicial' && value !== null) {
                                return [
                                    `💰 Investimento: R$ ${investimento.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                                    `Início do projeto`
                                ];
                            }
                            
                            return null;
                        },
                        labelTextColor: function(context) {
                            const dataset = context.dataset;
                            const value = context.parsed.y;
                            
                            if (dataset.id === 'principal') {
                                return value < 0 ? '#ff4d4d' : '#ffd700';
                            }
                            if (dataset.id === 'payback') {
                                return '#00ff88';
                            }
                            if (dataset.id === 'investimento_inicial') {
                                return '#ff6b6b';
                            }
                            return '#ffffff';
                        },
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: "white",
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Período (Anos)',
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ticks: { 
                        color: "white",
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Valor Acumulado (R$)',
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            hover: {
                mode: 'index',
                intersect: false,
                animationDuration: 400
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    hitRadius: 20,
                    hoverRadius: 10,
                    hoverBorderWidth: 3
                }
            }
        }
    });
}

// calcular o acumulo de rende após o pagamento do investimento 
function calcularPayback(investimento, economiaAnual25Anos) {

    let acumulado = 0;

    const dados = [];

    for (let i = 0; i < economiaAnual25Anos.length; i++) {

        acumulado += economiaAnual25Anos[i].economia;

        const liquido = acumulado - investimento;

        dados.push({
            ano: economiaAnual25Anos[i].ano,
            acumulado: Number(liquido.toFixed(2))
        });
    }

    return dados;
}

// acrescentar o aumento de 4% na energia a cada ano no valor economizado
function gerarEconomia25Anos(potenciaInicial, valorConta) {

    const anos = 25;
    const degradacao = 0.005;
    const aumentoTarifa = 0.04;

    let resultados = [{ano: 0, economia: 0}];

    for (let ano = 1; ano <= anos; ano++) {

        const potenciaAno =
            potenciaInicial * Math.pow(1 - degradacao, ano); //decresce a potência com os anos

        const contaAno =
            valorConta * 12 * Math.pow(1 + aumentoTarifa, ano); //energia elétrica tende a aumentar o preço 

        const economiaAno =
            contaAno * 0.90; // assume 90% compensação média

        resultados.push({
            ano,
            potencia_kWp: Number(potenciaAno.toFixed(2)),
            conta_estimada: Number(contaAno.toFixed(2)),
            economia: Number(economiaAno.toFixed(2))
        });
    }

    return resultados;
}

//calculator function 
function calcular(){
    //variáveis
    const valorConta = Number(valorContaInput.value);
    const consumoKwh = Number(valorKwhInput.value);

    if(valorConta !== 0 && consumoKwh !== 0){
        //valores
        const irradiacao_media = 4.5; //kWh/m2/dia
        const potencia_placa = 550; //W
        const area_painel =  2.74 //m²/placa
        const custo = 5000 //R$/kWp
        const conta_atual = Math.max(valorConta * 0.1, 40)
        
        // 1. calcular a potência necessária do sistema fotovoltaico
        const potencia = consumoKwh / (irradiacao_media * 30 * 0.75); //kWp
        // 2. calcular a quantidade de placas necessárias
        const quantidade_placas = Math.ceil(potencia * 1000 / potencia_placa); 
        // 3. calcular o espaço de instalação necessário
        const espaco_instalacao = Math.ceil(quantidade_placas * area_painel * 1.2);
        // 4. calcular o investimento inicial
        const investimento =  Math.ceil(potencia * custo); 
        // 5. calcular a economia anual
        const economia_anual = (valorConta - conta_atual) * 12; //R$/ano
        // 6. calcular o retorno do investimento
        const retorno =  Math.ceil(investimento / economia_anual); //em anos


        //organizando o resultado
        const resultado = {
            potencia,
            quantidade_placas,
            espaco_instalacao,
            investimento,
            conta_atual,
            economia_anual,
            retorno
        };
        console.log(JSON.stringify(resultado, null, 2));

        //imprimindo as variáveis
        document.getElementById("novaConta").innerText =
        `R$ ${conta_atual},00`;
        document.getElementById("economiaAno").innerText =
            `R$ ${economia_anual.toLocaleString('pt-BR')},00`;

        document.getElementById("placas").innerText =
            quantidade_placas;
        document.getElementById("investimento").innerText =
            `R$ ${investimento.toLocaleString('pt-BR')},00`
        document.getElementById("retorno").innerText =
            `${retorno} anos`;
        document.getElementById("espaco").innerText =
        `${espaco_instalacao}m²`;
        gerarEconomia25Anos(potencia, valorConta)

        //calcular aumento da energia nos próximos anos
        const economiaProjecao = gerarEconomia25Anos(potencia, valorConta);

        const paybackData = calcularPayback(investimento, economiaProjecao);
        renderPaybackChart(paybackData, investimento);
    }
}

//Inputs Events
valorContaInput.addEventListener(
    "input",
    calcular
);

valorKwhInput.addEventListener(
    "input",
    calcular
);