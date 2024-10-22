const { MailerSend, EmailParams, Recipient } = require("mailersend");


const mailersend = new MailerSend({
    apiKey: "your_mailersend_api_key", // Sua chave de API da MailerSend
});

window.onload = function() {
    let cidade, estado;
    let cepInput = document.getElementById('cep');
    let endereco = document.getElementById('endereco');
    let nomeInput = document.getElementById('nome');
    let emailInput = document.getElementById('email');
    let enviarButton = document.getElementById('enviarButton');

    // Verifica o CEP e preenche o endereço automaticamente
    cepInput.oninput = function() {
        let t = cepInput.value;
        const url = 'https://viacep.com.br/ws/' + t + '/json/';

        if (t.length == 8) {
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    endereco.value = data.logradouro;
                    estado = data.uf;
                    cidade = data.localidade;
                } else {
                    endereco.value = '';
                }
            });
        } else {
            endereco.value = '';
        }
    };

    // Envia e-mail apenas se a cidade for São Paulo e o estado SP
    enviarButton.onclick = function() {
        if (cidade === "São Paulo" && estado === "SP") {
            enviarEmail(nomeInput.value, emailInput.value, endereco.value);
        } else {
            alert("O e-mail só será enviado se você for de São Paulo capital.");
        }
    };

    // Função para enviar o e-mail usando MailerSend
    function enviarEmail(nome, email, endereco) {
        const recipients = [new Recipient(email, nome)];

        const emailParams = new EmailParams()
            .setFrom("info@domain.com")
            .setFromName("Your Name")
            .setRecipients(recipients)
            .setSubject("Formulário Recebido - São Paulo")
            .setHtml(`<p>Olá ${nome}, recebemos seu formulário.</p><p>Seu endereço é ${endereco}.</p>`)
            .setText(`Olá ${nome}, recebemos seu formulário. Seu endereço é ${endereco}.`);

        mailersend.send(emailParams)
        .then(response => {
            console.log('E-mail enviado com sucesso:', response);
            alert('E-mail enviado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao enviar e-mail:', error);
            alert('Erro ao enviar o e-mail.');
        });
    }
};