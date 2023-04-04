module.exports = {
    subject: "Vérification de l'Email",
    html: `
    <div style="text-align: center; font-family: Ubuntu">
        <div class="main">
            <h1>Vérification des e-mails DIMLIM</h1>
            <p>Bonjour {username}, nous avons reçu une demande de vérification de votre adresse e-mail</p>
    
            <h3>Pour vérifier votre adresse e-mail, veuillez cliquer sur le bouton suivant:</h3>
            <a href="{link}" style="background-color: #5294e2; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
        <br>
        <br>
            <p>Si cela n'a pas fonctionné, veuillez copier et coller le lien suivant dans votre barre de recherche:</p>
            <p style="color: #5294e2">{link}</p>
        </div>
    
        <br>
        <br>
    
        <div class="footer">
            <p>Si vous n'avez pas demandé cet e-mail, veuillez l'ignorer.</p>
        </div>
    </div>
    `,
};
