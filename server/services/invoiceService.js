import path from "path";
import PDFDocument from "pdfkit";

export const createInvoicePDF = async (order) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    return pdfBuffer;
  });

  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generateFooter(doc);

  // Finalize the PDF document
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });
};

function generateHeader(doc) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const logoPath = path.join(__dirname, "..", "assets", "logo.png");

  doc
    .image(logoPath, 50, 45, { width: 100 })
    .fontSize(10)
    .text("SellerTo", 200, 50, { align: "right" })
    .text("123 rue pdf", 200, 65, { align: "right" })
    .text("Paris, France, 75001", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, order) {
  const { user } = order;

  doc.fillColor("#444444").fontSize(20).text("Facture", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Numéro de Facture:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(order.orderUnique, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date de Facture:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Montant Dû:", 50, customerInformationTop + 30)
    .text(formatCurrency(order.amount), 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(`${order.firstname} ${order.lastname}`, 300, customerInformationTop)
    .font("Helvetica")
    .text(order.email, 300, customerInformationTop + 15)
    .text(
        order.address ? order.address : "Adresse non fournie",
      300,
      customerInformationTop + 30
    )
    .text(
      `${order.postalCode ? order.postalCode : ""} ${
          order.city ? order.city : ""
      }, ${order.country ? order.country : ""}`,
      300,
      customerInformationTop + 45
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, order) {
  const products = order.products;
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Produit",
    "Description",
    "Prix Unitaire",
    "Quantité",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < products.length; i++) {
    const item = products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.product.product_title,
      item.product.product_description,
      formatCurrency(item.product.product_price),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Sous-total",
    "",
    formatCurrency(order.amount)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Montant Payé",
    "",
    formatCurrency(0)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Montant Dû",
    "",
    formatCurrency(order.amount)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Le paiement est dû dans les 15 jours. Merci pour votre achat.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(value) {
  return `€${value.toFixed(2)}`;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
