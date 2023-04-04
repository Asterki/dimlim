module.exports = {
    subject: "Verificacion de email",
    html: `
    <div style="text-align: center; font-family: Ubuntu">
        <div class="main">
            <h1>Verificación de correo electrónico DIMLIM</h1>
            <p>Hola, {username}, recibimos una solicitud para verificar tu correo electrónico.</p>
    
            <h3>Para verificar tu correo electrónico, haga clic en el siguiente botón:</h3>
            <a href="{link}" style="background-color: #5294e2; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
        <br>
        <br>
            <p>Si eso no funcionó, copie y pegue el siguiente enlace en su barra de búsqueda:</p>
            <p style="color: #5294e2">{link}</p>
        </div>
    
        <br>
        <br>
    
        <div class="footer">
            <p>Si no solicitó este correo electrónico, ignórelo.</p>
        </div>
    </div>
    `,
};
