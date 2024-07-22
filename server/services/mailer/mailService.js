import nodemailer from 'nodemailer';

export async function sendNewProductAlertEmail(userEmail, product) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log('Product ID:', product.id); // Assurez-vous que cela affiche l'ID correct
        const info = await transporter.sendMail({
            from: '"SellerTo" <no-reply@sellerto.com>',
            to: userEmail,
            subject: `Nouveau produit disponible dans la catégorie ${product.product_category} chez SellerTo`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
                    <h2 style="color: #000;">Bonjour,</h2>
                    <p style="color: #000;">Un nouveau produit a été ajouté dans la catégorie ${product.product_category}.</p>
                    <p style="color: #000;">Nom du produit: ${product.product_title}</p>
                    <p style="color: #000;">Description: ${product.product_description}</p>
                    <p style="color: #000;">Prix: ${product.product_price} €</p>
                    <a href="http://localhost:5173/product/${product.id}" style="display: inline-block; padding: 10px 20px; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Voir le produit</a>
                </div>
            `,
        });

        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendDeliveryConfirmationEmail(userEmail, trackingNumber, userName, userAddress, orderDate, products) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const productItems = products.map(product => `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <img src="${product.photo}" alt="Product Image" style="width: 200px; height: 200px; object-fit: cover; margin-right: 20px; border-radius: 5px;">
      <div>
        <p style="color: #000;"><strong>${product.title}</strong></p>
        <p style="color: #000;">Vendu par ${product.vendor}<br>Qté : ${product.quantity}<br>EUR : ${product.price} €</p>
      </div>
    </div>
  `).join('');

    let info = await transporter.sendMail({
        from: '"SellerTo" <no-reply@sellerto.com>',
        to: userEmail,
        subject: 'Confirmation de livraison par SellerTo',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; border: 1px solid #e0e0e0; padding: 20px; border-radius: 5px;">
        <h2 style="color: #000;">Bonjour,</h2>
        <p style="color: #000;">Nous vous remercions pour votre commande. Nous vous tiendrons informé par e-mail lorsque les articles de votre commande auront été expédiés.</p>
        <p style="color: #000;">Votre date de livraison estimée est indiquée ci-dessous. Vous pouvez suivre l'état de votre commande dans <a href="http://localhost:5173/orders" style="color: #000;">Vos commandes sur SellerTo</a>.</p>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        <h3 style="color: #000;">Confirmation de votre commande</h3>
        <p style="color: #000;"><strong>Livraison prévue le </strong> ${orderDate}</p>
        <p style="color: #000;"><strong>Votre commande sera expédiée à :</strong></p>
        <p style="color: #000;">${userName}<br>${userAddress}</p>
        <p style="color: #000;"><strong>Votre mode de livraison :</strong> Livraison Prioritaire</p>
        <p style="color: #000;"><strong>Vos préférences d'expédition :</strong> Envoyer chaque article dès qu'il est disponible.</p>
        <p style="color: #000;"><strong>Commande n°:</strong> ${trackingNumber}</p>

        <a href="http://localhost:5173/orders" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Afficher les détails de la commande</a>

        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>

        ${productItems}
      </div>
    `,
    });
}


export async function sendPriceChangeAlertEmail(userEmail, product) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log('Product ID:', product.id); // Assurez-vous que cela affiche l'ID correct
        const info = await transporter.sendMail({
            from: '"SellerTo" <no-reply@sellerto.com>',
            to: userEmail,
            subject: `Changement de prix chez SellerTo pour le produit ${product.product_title}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
                    <h2 style="color: #000;">Bonjour,</h2>
                    <p style="color: #000;">Le prix du produit suivant a été modifié :</p>
                    <p style="color: #000;">Nom du produit: ${product.product_title}</p>
<!--                    <p style="color: #000;">Ancien prix: ${product.old_price} €</p>-->
                    <p style="color: #000;">Nouveau prix: ${product.product_price} €</p>
                    <a href="http://localhost:5173/product/${product.id}" style="display: inline-block; padding: 10px 20px; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Voir le produit</a>
                </div>
            `,
        });

        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendRestockAlertEmail(userEmail, product) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log('Product ID:', product.id); // Assurez-vous que cela affiche l'ID correct
        const info = await transporter.sendMail({
            from: '"SellerTo" <no-reply@sellerto.com>',
            to: userEmail,
            subject: `Produit réapprovisionné pour le produit ${product.product_title}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
                    <h2 style="color: #000;">Bonjour,</h2>
                    <p style="color: #000;">Le produit suivant est de nouveau en stock :</p>
                    <p style="color: #000;">Nom du produit: ${product.product_title}</p>
                    <p style="color: #000;">Description: ${product.product_description}</p>
                    <p style="color: #000;">Prix: ${product.product_price} €</p>
                    <a href="http://localhost:5173/product/${product.id}" style="display: inline-block; padding: 10px 20px; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Voir le produit</a>
                </div>
            `,
        });

        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendLowStockAlertEmail(product) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log('Product ID:', product.id); // Assurez-vous que cela affiche l'ID correct
        const info = await transporter.sendMail({
            from: '"SellerTo" <no-reply@sellerto.com>',
            to: '',
            subject: 'Alerte de stock faible',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
                    <h2 style="color: #000;">Alerte de stock faible</h2>
                    <p style="color: #000;">Le produit suivant a un stock inférieur à 4 :</p>
                    <p style="color: #000;">Nom du produit: ${product.product_title}</p>
                    <p style="color: #000;">Description: ${product.product_description}</p>
                    <p style="color: #000;">Prix: ${product.product_price} €</p>
                    <p style="color: #000;">Stock actuel: ${product.product_stock}</p>
                    <a href="http://localhost:5173/product/${product.id}" style="display: inline-block; padding: 10px 20px; background-color: #0e51c2; color: #fff; text-decoration: none; border-radius: 5px;">Voir le produit</a>
                </div>
            `,
        });

        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}