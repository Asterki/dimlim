export const subject = "Verificação de e-mail";
export const html = `
    <div style="text-align: center; font-family: Ubuntu">
        <div class="main">
            <h1>Verificação de e-mail DIMLIM</h1>
            <p>Olá {username}, recebemos uma solicitação para verificar seu e-mail</p>
    
            <h3>Para verificar seu e-mail, clique no próximo botão:</h3>
            <a href="{link}" style="background-color: #5294e2; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
        <br>
        <br>
            <p>Se não funcionou, copie e cole o próximo link na barra de pesquisa:</p>
            <p style="color: #5294e2">{link}</p>
        </div>
    
        <br>
        <br>
    
        <div class="footer">
            <p>Se você não solicitou este e-mail, ignore-o.</p>
        </div>
    </div>
    `;
