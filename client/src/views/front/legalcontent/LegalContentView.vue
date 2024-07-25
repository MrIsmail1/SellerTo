<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const state = reactive({
  title: '',
  content: ''
});

const route = useRoute();

const loadContent = () => {
  const contentType = route.meta.contentType;
  if (contentType === 'legal-mentions') {
    state.title = 'Mentions Légales';
    state.content = `
      <h3>Qui est le responsable du traitement de mes données personnelles ?</h3>
      <p>Le responsable de traitement est la personne, l’autorité publique ou l’organisme qui détermine les finalités c’est-à-dire à quoi servent les données et les moyens du traitement.</p>
      <p>SellersTo S.A, RCS LILLE sous n° 94848303700016. Siège Social : 210 avenue du 8 mai 1945, Le Blanc Mesnil, est responsable de traitement. (Tel : 0767336979, Email : hamzamahmood93150@gmail.com).</p>
      <p>Lorsque vos données sont collectées dans un magasin sous franchise SellerTo, le franchisé est responsable conjoint de traitement avec SellerTo.</p>
      
      <h3>Quelles sont les données personnelles collectées me concernant ?</h3>
      <p>Type de données :</p>
      <ul>
        <li><strong>Données d'identité :</strong> civilité, nom, prénom, adresse postale, numéro de téléphone (fixe et/ou mobile), adresse de courrier électronique, identifiant interne client, date de naissance, le cas échéant, N° de carte de fidélité.</li>
        <li><strong>Données relatives aux produits et services souscrits auprès de SellerTo :</strong> numéro de commande, détail de l’achat et/ou de l’abonnement et/ou du service souscrit (produit ou service concerné, montant, date et lieu de la transaction, mode et date de livraison, partenaire concerné dans le cadre d’une vente « pour le compte de », repreneur concerné dans le cadre d’un rachat).</li>
        <li><strong>Données relatives aux règlements des factures :</strong> modalités de règlement, remises consenties, reçus, soldes, le cas échéant chèque fidélité.</li>
        <li><strong>Données de navigation :</strong> adresse IP, historique de navigation comme les pages consultées, les clics effectués.</li>
        <li><strong>Données conversationnelles :</strong> données relatives au suivi de la relation commerciale : données nécessaires liées à la nature de votre demande sur le canal que vous avez choisi (Email, tchat, téléphone…), données d’identité, données relatives à vos achats, correspondance avec le service client, descriptif.</li>
        <li><strong>Données fidélité :</strong> données nécessaires au "cagnottage", calcul et solde des points fidélité, numéro des chèques fidélité émis utilisés ou non.</li>
        <li><strong>Données communautaires :</strong> textes, photos, liens vidéo publiés sur la communauté et interaction entre les membres.</li>
      </ul>
      
      <h3>Délégué à la protection des données</h3>
      <p>SellerTo a nommé un Délégué à la Protection des Données chargé d’accompagner SellerTo dans la conformité des collectes et traitements que SellerTo est amenée à réaliser, à tenir la liste des traitements mis en œuvre, ainsi qu’à assurer l’exercice de vos droits.</p>
      <p>Vous pouvez contacter le Délégué à la protection des données personnelles de SellerTo à l’adresse hamzamahmood93150@gmail.com (hors exercice de vos droits : afin de garantir le délai de réponse légal, la marche à suivre pour exercer vos droits est détaillée dans le chapitre « Exercer mes droits sur mes données »).</p>
      
      <h3>Sécurité</h3>
      <p>SellerTo est attentif à la sécurité de vos données personnelles et met en œuvre toutes les mesures techniques et organisationnelles appropriées au regard de la nature, de la portée et du contexte du traitement des données que vous nous communiquez.</p>
      <p>Ces mesures visent à préserver la sécurité de vos données et empêcher toute destruction, perte, altération, divulgation, intrusion ou accès non autorisé à ces données, de manière accidentelle ou illicite.</p>
      <p>Vos données personnelles sont stockées sur des serveurs sécurisés, accessibles à un nombre limité de personnes ayant des droits d’accès spécifiques à ces systèmes.</p>
      
      <h3>Définitions relatives au calcul des durées de conservation des données chez SellerTo</h3>
      <p>Les personnes dites « prospect » sont les personnes n’ayant jamais effectué d’achat auprès de SellerTo et/ou de ses partenaires. Le point de départ de la durée de conservation est établi en fonction du dernier contact avec SellerTo. Le dernier contact est déterminé comme la date la plus récente parmi les événements suivants : création/accès au compte depuis votre espace digital, inscription à la newsletter, clic dans un Email.</p>
      <p>Les personnes dites « clients » sont les personnes ayant effectué au moins un achat d’un produit ou d’un service auprès de SellerTo (y compris les achats effectués auprès d’un partenaire via SellerTo). Le point de départ de la durée de conservation est établi en fonction du dernier contact avec SellerTo et/ou de la fin de la relation commerciale. La fin de la relation commerciale est déterminée comme la date de fin de garantie la plus récente.</p>
      
      <h3>SellerTo traite vos données personnelles pour les finalités suivantes</h3>
      <table>
        <thead>
          <tr>
            <th>Finalités</th>
            <th>Données traitées</th>
            <th>Base légale</th>
            <th>Durée de conservation pour les finalités visées</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gestion du compte client</td>
            <td>Données d'identité</td>
            <td>Exécution de nos obligations contractuelles pour commandes avec livraison ou emporté différé<br>Autre cas : Intérêt légitime de SellerTo</td>
            <td>Clients 3 ans après le dernier contact et/ou la fin de la relation commerciale à l’exception des données d’identification strictement nécessaires à la consultation et à la réédition des factures : ces données sont conservées dix ans à compter du dernier achat du client</td>
          </tr>
          <tr>
            <td>Commande, livraison, facturation, service après-vente, comptabilité client</td>
            <td>Données d’identité, données relatives à vos achats, données relatives aux règlements des factures</td>
            <td>Exécution de nos obligations contractuelles<br>Obligation légale Article L123-22 alinéa 2 du Code de commerce</td>
            <td>Livraison 5 ans à compter de la date de livraison<br>Factures 10 ans à compter de la date de facture ou durée de garantie supérieure<br>Historique des achats et données comptables 10 ans à compter de la date de facture</td>
          </tr>
          <tr>
            <td>Opérations réalisées dans le cadre de l’exécution des Conditions Générales du Service "Rachat SellerTo"</td>
            <td>Donnée d’identité, données relatives au rachat, données relatives au paiement</td>
            <td>Exécution de nos obligations contractuelles</td>
            <td>En l’absence d’un compte client SellerTo : 3 mois après la reprise<br>Si vous avez opté pour le paiement via une carte cadeau dématérialisée, votre adresse Email sera conservée 1 an après l’envoi du code d’activation en base archive<br>Les données relatives au rachat reliées à un compte client SellerTo peuvent être conservées tant que le compte client SellerTo est actif et sont supprimées au plus tard 10 ans après la reprise</td>
          </tr>
          <tr>
            <td>Relation client</td>
            <td>Données conversationnelles, données relatives au suivi de votre demande</td>
            <td>Intérêt légitime de SellerTo</td>
            <td>Enregistrement téléphonique 3 mois<br>Historique des conversations tchat 3 mois<br>Dossier : 2 ans</td>
          </tr>
          <tr>
            <td>Enquête de satisfaction et sondages<br>Dépôt des avis produits<br>- Modération et notifications<br>- Publication des avis produits acceptés</td>
            <td>Données d’identité, données relatives aux achats</td>
            <td>Envoi des enquêtes, et publication des avis acceptés : Intérêt légitime de SellerTo<br>Vous pouvez vous opposer à recevoir des enquêtes, sondage et demande de dépôt d’avis depuis votre espace digital<br>Modération et notifications des avis produits suite au dépôt d’un avis : Acceptation des CGU</td>
            <td>Enquête de satisfaction : 1 an après la collecte<br>Avis produit : les avis sont conservés 5 ans après la date de publication</td>
          </tr>
          <tr>
            <td>Profilage à des fins de personnalisation des communications et publicités, d’analyses statistiques agrégées</td>
            <td>Données d’identité, données d’achats, données de navigation</td>
            <td>Intérêt légitime pour le profilage publicitaire<br>Consentement pour la collecte des données de navigation</td>
            <td>3 ans après le dernier contact et/ou la fin de la relation commerciale</td>
          </tr>
          <tr>
            <td>Communications et publicités (personnalisée ou non) par SMS, Email ou courrier postal ou push notification</td>
            <td>Données d'identité</td>
            <td>Intérêt légitime<br>⦁ Diffusion par Email et/ou SMS pour un client sur un produit ou service analogue<br>⦁ Courrier postal<br>Consentement<br>⦁ Diffusion par Email et/ou SMS<br>⦁ Notification par Push</td>
            <td>3 ans après le dernier contact et/ou la fin de la relation commerciale</td>
          </tr>
          <tr>
            <td>Bannières publicitaires en ligne promouvant les produits et services de SellerTo</td>
            <td>Email et N° de téléphone pseudonymisés (c'est-à-dire qu’elles ne permettent pas de vous identifier directement, vos prénoms, noms, adresses email n’apparaissent pas en clair, ils sont transformés en une suite de chiffres et de lettres aléatoires)</td>
            <td>Consentement aux cookies publicitaires pour l’affichage de publicités ciblées</td>
            <td>13 mois</td>
          </tr>
          <tr>
            <td>Communautés SellerTo</td>
            <td>Données d'identité, données communautaires</td>
            <td>Exécution du contrat (acceptation des CGU de la communauté)</td>
            <td>3 ans après le dernier contact<br>Les contenus sont conservés sans limitation de durée au profit de la communauté</td>
          </tr>
          <tr>
            <td>Prévention de la fraude</td>
            <td>Données d’identité, données d’achats, données de navigation</td>
            <td>Intérêt légitime et impérieux de SellerTo</td>
            <td>2 ans après inscription</td>
          </tr>
          <tr>
            <td>Enregistrement & gestion des candidatures</td>
            <td>Données d’identité, données relatives à la carrière du candidat : CV, lettre de motivation, niveau de formation, profession / fonction dans l’entreprise, expériences passées, recommandations</td>
            <td>Le traitement est nécessaire à l’exécution des mesures précontractuelles et à l’établissement de la relation contractuelle entre SellerTo et les candidats à un emploi ou à un stage</td>
            <td>2 ans après la collecte</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Nos sous-traitants</h3>
      <p>Dans le cadre de notre activité, nous sommes amenés à faire appel à des sous-traitants, auxquels nous transmettons vos données pour la réalisation des missions qui leurs sont confiées. SellerTo reste responsable du traitement réalisé sur vos données et nous nous assurons de la conformité de l’utilisation de vos informations et des normes de sécurité utilisées. Nous faisons appel à plusieurs catégories de sous-traitants :</p>
      <ul>
        <li>Nos sous-traitants techniques (hébergement, supervision informatique …)</li>
        <li>Nos sous-traitants logistiques (préparation des commandes, transport ...)</li>
        <li>Nos sous-traitants de paiement (prévention de la fraude, prise en charge du paiement)</li>
        <li>Nos sous-traitants en charge de la relation client (plate-forme téléphonique, tchat, avis produit, enquête de satisfaction, sondage, prise de RDV ...)</li>
        <li>Nos sous-traitants en charge du service après-vente (stations de réparations, gestion des retours produits …)</li>
        <li>Nos sous-traitants marketing (opérations de prospections, gestion des jeux concours, régies publicitaires, recommandations & personnalisation...)</li>
        <li>Nos sous-traitants en charge de la gestion des communautés SellerTo (réseau social de la marque et FAQ communautaire)</li>
      </ul>
      
      <h3>Nos prestataires de transports</h3>
      <p>Dans le cadre de votre livraison, SellerTo transfère les données vous concernant (nom, prénom, numéro de téléphone, adresse électronique, numéro de facture) aux prestataires de transports afin d’assurer la livraison de votre colis et en permettre le suivi. Dans le cadre de la gestion des litiges nous sommes susceptibles de vous demander une attestation sur l’honneur et la transmettre à ces partenaires.</p>
      <p>S’agissant de l’exécution de la livraison, la responsabilité du traitement dépend du rôle du prestataire sur la mise en œuvre des moyens essentiels.</p>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Qualité</th>
            <th>Durée de conservation du prestataire</th>
            <th>Informations supplémentaires et transfert hors UE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Colissimo (La poste)</td>
            <td>Sous-traitant / responsable conjoint sur la gestion des litiges</td>
            <td>Base active (durée de la livraison)<br>Base archive 13 mois à compter de la livraison</td>
            <td>Colissimo (La Poste) est susceptible de transférer vos données hors de l’Union Européenne dans le cadre de l’externalisation de son activité de service client (notamment Maroc, Sénégal, Ile Maurice) Pour davantage d’information <a href="https://www.laposte.fr/donnees-personnelles-et-cookies">https://www.laposte.fr/donnees-personnelles-et-cookies</a></td>
          </tr>
          <tr>
            <td>Chronopost</td>
            <td>Destinataire des données en tant que responsable de traitement disjoint</td>
            <td>Pour davantage d’information <a href="https://www.chronopost.fr/fr/politique-informatique-et-libertes">https://www.chronopost.fr/fr/politique-informatique-et-libertes</a></td>
            <td></td>
          </tr>
          <tr>
            <td>DPD</td>
            <td>Destinataire des données en tant que responsable de traitement disjoint</td>
            <td>Pour davantage d’information <a href="https://www.dpd.com/fr/fr/confidentialite-donnees-personnelles/">https://www.dpd.com/fr/fr/confidentialite-donnees-personnelles/</a></td>
            <td></td>
          </tr>
          <tr>
            <td>Mondial Relay</td>
            <td>Destinataire des données en tant que responsable de traitement disjoint</td>
            <td>Pour davantage d’information <a href="https://www.mondialrelay.fr/donnees-personnelles-et-cookies-via-partenaires">https://www.mondialrelay.fr/donnees-personnelles-et-cookies-via-partenaires</a></td>
            <td></td>
          </tr>
          <tr>
            <td>Colis Privé</td>
            <td>Destinataire des données en tant que responsable de traitement disjoint</td>
            <td>Pour davantage d’information <a href="https://www.colisprive.fr/politique-de-confidentialite">https://www.colisprive.fr/politique-de-confidentialite</a></td>
            <td></td>
          </tr>
          <tr>
            <td>Fedex</td>
            <td>Destinataire des données en tant que responsable de traitement disjoint</td>
            <td>Pour davantage d’information <a href="https://www.fedex.com/fr-fr/privacy-policy.html">https://www.fedex.com/fr-fr/privacy-policy.html</a></td>
            <td></td>
          </tr>
          <tr>
            <td>Warning</td>
            <td>Sous-traitant / responsable conjoint sur la gestion des litiges</td>
            <td>Livraison : Base active le temps de la livraison puis base archive 13 mois à compter de la transmission des données<br>Gestion des litiges (durée définie par chacune des parties)</td>
            <td>Pour davantage d’information <a href="https://www.warning.fr/politique-donnees-personnelles/">https://www.warning.fr/politique-donnees-personnelles/</a></td>
          </tr>
        </tbody>
      </table>
      
      <h3>Partage des données avec un tiers</h3>
      <p>Dans le cadre de notre activité, nous sommes amenés à transmettre vos données à d’autres responsables de traitements. Cette transmission intervient lorsque SellerTo :</p>
      <ul>
        <li>Vos données sont collectées directement par SellerTo, nous sommes responsables des informations que nous conservons.</li>
        <li>Vos données sont transmises à nos partenaires pour les finalités décrites ci-dessus.</li>
      </ul>
      <p>Notre partenaire est le responsable de traitement des données qui lui sont transmises. Pour tout exercice de vos droits d’accès, de rectification ou d’opposition, nous vous invitons à consulter l’onglet « Mentions Légales » ou « Politique de confidentialité » de l’entreprise partenaire concernée et/ou à consulter les mentions rédigées ci-dessous pour certains de nos partenaires.</p>
      <p>SellerTo ne cédera pas vos données personnelles à des entreprises dont la finalité est l’acquisition de nouveaux prospects et l’envoi de prospection commerciale par SMS et/ou par Email sans accord exprès de votre part.</p>
      
      <h3>Votre banque</h3>
      <p>Depuis l'entrée en vigueur des Normes Techniques Règlementaires le 14 septembre 2019 précisant les modalités d’application d’une authentification forte pour tous les paiements à distance et uniquement pour les moyens de paiement concernés, votre banque sera destinataire des données de votre carte (le numéro ainsi que sa date d’expiration), des données correspondant à l’opération effectuée au moyen de celle-ci ainsi que des données relatives au contexte de votre achat (souhait de SellerTo de déclencher ou non une authentification forte, vos coordonnées, des données techniques relatives à l’appareil et au navigateur que vous avez utilisé) à des fins d'évaluation d'un niveau de confiance lié à la transaction. Pour les paiements par carte bancaire pour lesquels la marque CB a été choisie, ces mêmes données seront transmises au GIE Cartes Bancaires. Vous pouvez exercer vos droits :</p>
      <ul>
        <li>À votre banque en vous référant à la politique de confidentialité/protection des données personnelles de votre banque ou à votre contrat porteur</li>
        <li>Au GIE Cartes Bancaires dans les conditions prévues dans leur Politique de protection des données personnelles accessible à <a href="https://www.cartes-bancaires.com/protegezvosdonnees/porteur/">https://www.cartes-bancaires.com/protegezvosdonnees/porteur/</a></li>
      </ul>
      
      <h3>Médias sociaux</h3>
      <p>Médias sociaux Google et Meta (Ex Facebook) : transmission des coordonnées pseudonymisées de l’Email et N° de téléphone nécessaires à la constitution de listes d’audiences en vue de la diffusion sur ces sites de bannières publicitaires destinées aux clients de SellerTo.</p>
      
      <h3>Réseaux sociaux</h3>
      <p>Le site www.sellerto.com ainsi que l’application mobile SellerTo utilisent des « plug-in » sociaux. Il s'agit notamment des boutons « j'aime», « partager » des réseaux sociaux comme Facebook, Twitter, Google+… Lorsque vous utilisez la fonction « partage », vous autorisez SellerTo à publier le contenu sur votre profil réseau social correspondant. De même, en activant la mention « j’aime » ou « suivre », vous autorisez le suivi de nos publications dans votre flux d’actualité.</p>
      
      <h3>Toutes autorités administratives ou judiciaires compétentes</h3>
      <p>Ces données peuvent être communiquées à toute autorité administrative ou judiciaire qui en ferait la demande.</p>
      
      <h3>Quels sont vos droits ?</h3>
      <p>Vous disposez de l’ensemble des droits en vertu de la Loi n° 78-17 du 6 janvier 1978 dite "Informatique et Libertés" et du Règlement Général sur la Protection des Données (accès, rectification, effacement des données, limitation du traitement sur ces données, opposition à l’utilisation de ces données, portabilité de ces données, directives relatives au sort de ces données après votre décès).</p>
      <p>Vous disposez également du droit de formuler une réclamation auprès de la CNIL.</p>
      
      <h3>Comment exercer mes droits vis à vis de mes données ?</h3>
      <p>Depuis votre compte : Vous accédez à vos données et votre historique d’achat. Depuis la rubrique « mes consentements » vous pouvez modifier vos choix.</p>
      <p>Depuis les liens de désabonnement en bas des Emails ou par STOP SMS : Chaque SMS, envoyé de notre initiative, vous informera de la possibilité d’un désabonnement « STOP SMS » à un numéro non surtaxé. Pour des raisons techniques, l’arrêt d’envoi de nos offres n’est pas immédiat. Un délai de 48 maximum est parfois constaté afin d’enregistrer et traiter votre demande.</p>
      <p>En écrivant votre demande par courrier postal à SellerTo - DPO - , 210 avenue du 8 mai 1945, Le Blanc Mesnil ou à l’adresse courriel hamzamahmood93150@gmail.com.</p>
      <p>Par votre inscription sur BLOCTEL : Conformément aux articles L.223-1 et suivants du code de la consommation, si vous ne souhaitez plus être démarché par téléphone sur le numéro communiqué à SellerTo vous pouvez inscrire à tout moment ce numéro de téléphone sur la liste d’opposition au démarchage téléphonique par Internet sur le site <a href="http://www.bloctel.gouv.fr">www.bloctel.gouv.fr</a>.</p>
      
      <h3>Push Notification</h3>
      <p>La désactivation des notifications doit être effectuée directement sur votre appareil :</p>
      <ul>
        <li>Push notification sur votre téléphone : vous pouvez à tout moment désactiver les notifications dans les paramétrages de votre téléphone mobile ainsi que dans l'application en vous rendant dans « mon compte » rubrique mes préférences.</li>
        <li>Push notification sur le WEB : vous pouvez à tout moment désactiver les notifications dans les paramétrages de votre navigateur internet ou bloquer les notifications directement sur une des notifications reçues.</li>
      </ul>
      
      <h3>Bon à savoir :</h3>
      <ul>
        <li><strong>Le droit d’effacement :</strong> c’est le droit pour toute personne à s’opposer, pour des motifs légitimes, à figurer dans un fichier.</li>
        <li><strong>Le droit d’accès :</strong> c’est le droit pour toute personne d’obtenir la communication de toutes les informations la concernant détenues par SellerTo.</li>
        <li><strong>Le droit de portabilité :</strong> c’est le droit d'obtenir que ses données à caractère personnel soient transmises dans un format structuré à elle-même ou directement d'un responsable du traitement à un autre, lorsque cela est techniquement possible.</li>
        <li><strong>Le droit de rectification :</strong> c’est le droit pour toute personne d’obtenir la rectification des informations inexactes la concernant détenues par SellerTo.</li>
        <li><strong>Le droit d’opposition :</strong> Le droit d'opposition s'exerce soit au moment de la collecte d’informations, soit plus tard, en s'adressant au responsable du fichier. En matière de prospection commerciale, toute personne peut s’opposer à tout moment à ce que ses données soient diffusées, transmises ou conservées. Ce droit peut s'exercer sans avoir à justifier d'un motif légitime.</li>
        <li><strong>Le droit de définir des directives relatives au sort de mes données à caractère personnel après mon décès :</strong> En l'absence de directives ou de mention contraire dans lesdites directives, les héritiers de la personne concernée peuvent après son décès exercer les droits sur les données personnelles du défunt.</li>
        <li><strong>Le droit de limitation du traitement :</strong> C’est le droit de faire suspendre un traitement le temps qu’une vérification puisse avoir lieu (vérifier l’exactitude des données personnelles, vérifier si les motifs légitimes donnés par la personne prévalent sur ceux du responsable de traitement dans le cas d’une demande d’opposition etc.).</li>
      </ul>
    `;


  } else if (contentType === 'cookies') {
    state.title = 'Politique des Cookies';
    state.content = `
      <h2>A propos des cookies et traceurs</h2>
      <p>Vos données, votre choix.</p>
      <p>Sur nos sites et nos applications, nous recueillons à chacune de vos visites des données vous concernant. Ces données nous permettent de vous proposer les offres et services les plus pertinents pour vous, et de vous adresser, en direct ou via des partenaires, des communications et publicités personnalisées et de mesurer leur efficacité. Ces données nous permettent également d’adapter le contenu de nos sites à vos préférences, de vous faciliter le partage de contenu sur les réseaux sociaux et de réaliser des statistiques.</p>
      <p>L’opposition aux cookies et autres traceurs se fait par le dépôt d’un cookie. Par conséquent, l’opposition ne vaut que pour l’appareil sur lequel vous vous opposez. Si vous vous connectez avec un autre appareil, ou si vous supprimez les cookies de votre appareil, vous devrez de nouveau régler vos paramètres de consentements.</p>
      <p>Les cookies ont une durée de validité de 13 mois maximum.</p>
      <h3>Les données collectées</h3>
      <p>Lorsque vous naviguez sur internet, les traceurs utilisent un identifiant digital (ID cookie ou ID mobile) qui permet de vous réidentifier lors d’une visite ultérieure. Selon le type de traitement et le type de traceur, des données complémentaires comme par exemple des données de navigation (pages visitées, produits consultés, clics effectués), l’adresse IP, le N° de commande etc. peuvent être associées à votre identifiant digital. Les données complémentaires dépendent des traitements, cette information sera précisée le cas échéant au niveau de chaque rubrique cookie et autres traceurs.</p>
      <h3>Les différents émetteurs</h3>
      <p><strong>Les cookies SellerTo</strong><br>Il s'agit des cookies déposés par SellerTo sur votre terminal. Il peut s’agir d’un cookie spécifique ou d’un cookie nécessaire à une fonctionnalité opérée par la solution logicielle d’un de nos sous-traitants.</p>
      <p><strong>Les cookies tiers</strong><br>Il s'agit des cookies déposés par d’autres sociétés que SellerTo sur votre terminal (par exemple des régies publicitaires, des partenaires, d’autres responsables de traitements).</p>
      <h3>Les destinataires</h3>
      <p><strong>Nos sous-traitants</strong><br>Dans le cadre de notre activité, nous sommes amenés à faire appel à des sous-traitants, pour lesquels nous utilisons des cookies et/ou autres traceurs pour la réalisation des missions qui leur sont confiées :</p>
      <ul>
        <li>nos sous-traitants en charge des solutions analytiques (AB test, mesures d’audience) ;</li>
        <li>nos sous-traitants en charge de la relation client (solutions de chat, avis produits) ;</li>
        <li>nos sous-traitants techniques ;</li>
        <li>nos sous-traitants en charge de la personnalisation de contenu et connaissance/reconnaissance client.</li>
      </ul>
      <p><strong>Nos partenaires responsables de traitement</strong><br>Les destinataires dépendent des traitements, cette information est précisée au niveau de chaque rubrique cookie et autres traceurs en cliquant sur l’icône d’information de la rubrique concernée.</p>
      <table>
        <thead>
          <tr>
            <th>Partenaire</th>
            <th>Catégorie</th>
            <th>Remarque</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cookiebot</td>
            <td>Essentiel</td>
            <td>Gestion des tags / Privacy</td>
          </tr>
        </tbody>
      </table>
      <h3>Les traceurs essentiels</h3>
      <p>Les traceurs essentiels sont utilisés sans votre consentement et vous ne pouvez pas vous opposer à ces traceurs.</p>
      <p>Les traceurs essentiels ont pour finalités :</p>
      <ul>
        <li>Opérations techniques (authentification à votre espace personnel, surveillance et optimisation des performances pour l’équilibrage de la charge, déploiement de patch correctif urgent, détection de problèmes de navigation, etc) ;</li>
        <li>Gestion de la « privacy » des traceurs ;</li>
        <li>Mémorisation du panier ;</li>
        <li>Conservation de vos paramètres de configuration pour une visite ultérieure (comme par exemple langue de préférence, magasin de préférence).</li>
      </ul>
      <p>Les finalités suivantes concernent uniquement l’application mobile :</p>
      <ul>
        <li>Surveillance des nouvelles installations de l’application (App store) ;</li>
        <li>Génération de traces lors de la survenance d’un « crash applicatif ».</li>
      </ul>
      <h3>Les traceurs exemptés</h3>
      <p><strong>Statistique anonyme :</strong> SellerTo est responsable de traitement des données collectées et traitées. Sur la base de son intérêt légitime, ces traceurs sont destinés à la production de statistiques de fréquentation anonymes du site afin d’optimiser son ergonomie, sa navigation et ses contenus. En désactivant ces cookies, nous ne pourrons pas analyser le trafic du site.</p>
      <h3>Les traceurs soumis au consentement</h3>
      <ul>
        <li><a href="#">Davantage d’information sur les traceurs statistiques enrichies</a></li>
        <li><a href="#">Davantage d’information sur les traceurs réseaux sociaux</a></li>
        <li><a href="#">Davantage d’information sur les traceurs relation client</a></li>
        <li><a href="#">Davantage d’information sur les traceurs contextualisation de contenus</a></li>
        <li><a href="#">Davantage d’information sur les traceurs publicité</a></li>
      </ul>
      <h3>Plus d'informations</h3>
      <p>Retrouvez plus d'informations sur l'utilisation des cookies sur le site de la CNIL : <a href="http://www.cnil.fr/vos-droits/vos-traces/les-cookies/">http://www.cnil.fr/vos-droits/vos-traces/les-cookies/</a></p>
    `;

  } else if (contentType === 'terms-of-use') {
    state.title = 'Conditions Générales d\'Utilisation';
    state.content = `
  <p>Les présentes Conditions Générales d'Utilisation (ci-après les "CGU") ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site www.sellerto.com (ci-après le "Site") par l'entreprise SellerTo (ci-après "SellerTo" ou "Nous").</p>
  <h3>ARTICLE 3 - MENTIONS LÉGALES</h3>
  <p>Nom de l'entreprise : SellerTo</p>
  <p>Adresse de l'entreprise : 210 avenue du 8 mai 1945, Le Blanc Mesnil</p>
  <p>Numéro de téléphone : 0767336979</p>
  <p>Adresse email : hamzamahmood93150@gmail.com</p>
  <p>Nom du directeur de publication : Mahmood</p>
  <p>Numéro SIRET : 94848303700016</p>
  <p>Numéro TVA intracommunautaire : FR12345678901</p>
  <p>Hébergeur du site : Digital Ocean, 101 Avenue of the Americas, New York 10013, United States of America, contact@digitalocean.com</p>

  <h3>ARTICLE 4 - SERVICES PROPOSÉS</h3>
  <p>SellerTo propose sur son Site la vente de divers articles et produits, ainsi que des services associés tels que la livraison, le service après-vente et le support client.</p>

  <h3>ARTICLE 5 - ACCÈS AU SITE</h3>
  <p>L'accès au Site est gratuit. Tous les coûts liés à l'accès au Site, que ce soit les frais matériels, logiciels ou d'accès à Internet, sont exclusivement à la charge de l'utilisateur. SellerTo se réserve le droit de suspendre, d'interrompre ou de limiter sans avis préalable l'accès à tout ou partie du Site.</p>

  <h3>ARTICLE 6 - UTILISATION DU SITE</h3>
  <p>L'utilisateur s'engage à utiliser le Site conformément aux présentes CGU et à la législation en vigueur. Il s'interdit notamment de :</p>
  <ul>
    <li>Porter atteinte à l'ordre public et aux bonnes mœurs.</li>
    <li>Tenir des propos injurieux, diffamatoires, racistes, xénophobes, révisionnistes ou portant atteinte à l'honneur ou à la réputation d'autrui.</li>
    <li>Utiliser le Site à des fins commerciales ou publicitaires.</li>
  </ul>

  <h3>ARTICLE 7 - PROPRIÉTÉ INTELLECTUELLE</h3>
  <p>Tous les éléments du Site (textes, images, sons, vidéos, logiciels, bases de données, etc.) sont la propriété exclusive de SellerTo ou de ses partenaires et sont protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du Site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite.</p>

  <h3>ARTICLE 8 - DONNÉES PERSONNELLES</h3>
  <p>SellerTo s'engage à protéger les données personnelles de ses utilisateurs conformément à la législation en vigueur. Pour plus d'informations, veuillez consulter notre Politique de Protection des Données Personnelles.</p>

  <h3>ARTICLE 9 - COOKIES</h3>
  <p>Le Site utilise des cookies pour améliorer l'expérience utilisateur, mesurer l'audience et proposer des publicités personnalisées. Pour plus d'informations, veuillez consulter notre Politique des Cookies.</p>

  <h3>ARTICLE 10 - RESPONSABILITÉ</h3>
  <p>SellerTo met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur le Site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le Site. SellerTo décline toute responsabilité pour les erreurs ou omissions, ainsi que pour les dommages résultant de l'utilisation de ces informations.</p>

  <h3>ARTICLE 11 - MODIFICATION DES CGU</h3>
  <p>SellerTo se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entreront en vigueur dès leur mise en ligne sur le Site. Il est recommandé aux utilisateurs de consulter régulièrement les CGU pour se tenir informés des éventuelles modifications.</p>

  <h3>ARTICLE 12 - LOI APPLICABLE ET JURIDICTION</h3>
  <p>Les présentes CGU sont régies par la loi française. En cas de litige et à défaut de solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.</p>

  <h3>ARTICLE 13 - CONTACT</h3>
  <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter par courrier électronique à l'adresse suivante : hamzamahmood93150@gmail.com ou par courrier postal à SellerTo, 210 avenue du 8 mai 1945, Le Blanc Mesnil.</p>
`;

  } else if (contentType === 'terms-of-sales') {
    state.title = 'Conditions Générales de Vente';
    state.content = `
      <p>Les présentes conditions générales de vente s'appliquent à toutes commandes passées sur ou avec le site internet www.sellerto.com, via la solution de tchat disponible sur le site www.sellerto.com ou par téléphone au 0767336979, numéros disponibles 7J/7 de 8h à 22h (Numéros gratuits, hors éventuels surcoûts de l'opérateur).</p>
      <p>Les présentes conditions s'appliquent à tout consommateur tel que défini par les directives européennes, à savoir « toute personne physique qui agit à des fins qui n’entrent pas dans le cadre de son activité commerciale, industrielle, artisanale ou libérale », et s’appliquent à l'exclusion de toutes autres conditions, notamment celles en vigueur pour les ventes en magasin.</p>
      <p>Dans l'intégralité des présentes, le client (ci-après « Client ») est entendu comme celui avec lequel s'établit la relation d'achat-vente et lequel est facturé au titre de la commande.</p>
      <p>Le site web de SellerTo propose au Client la vente de tous articles, produits ou services se rapportant à la communication, aux multimédias, au son, à l'image, à l'informatique, à la micro-informatique, à l'électroménager, à l'aménagement et l'équipement de la maison, mobiliers, objets de décoration, domotique, de tout appareil et/ou produit électrique, et plus généralement de toute forme de produits ou de services existants ou à créer permettant de mieux vivre le loisir et le confort à la maison et en activité nomade.</p>
      <p>Toute passation de commande sur le site www.sellerto.com, par tchat ou par téléphone, suppose la prise de connaissance des présentes conditions générales de ventes ainsi que l'accord du Client sur l'intégralité de leur contenu. SellerTo se réserve la possibilité d'adapter ou de modifier les présentes conditions générales de vente à tout moment. En ce cas, seules les conditions générales de vente en vigueur lors de la prise de commande seront alors applicables. SellerTo conseille au Client de sauvegarder et/ou imprimer les présentes conditions générales de vente pour une conservation sûre et durable, et pouvoir ainsi les invoquer à tout moment pendant l'exécution du contrat si besoin.</p>
      
      <h3>ARTICLE 2 - PRIX</h3>
      <p>2.1. Tous les prix des produits et services proposés à la vente sur le site www.sellerto.com sont exprimés en euros toutes taxes comprises hors participation aux frais de traitement et d'expédition. Ces frais de traitement et d'expédition sont ci-après consultables.</p>
      <p>2.2. SellerTo se réserve la faculté de modifier ses prix à tout moment mais s'engage à appliquer les tarifs en vigueur lors de l'enregistrement de la commande sous réserve de la disponibilité des produits à cette date.</p>
      <p>2.3. Les produits demeurent la propriété de SellerTo jusqu'à plein et entier encaissement du prix. Toutefois à compter de l'enlèvement ou de la réception de la commande par le Client ou son représentant, les risques des marchandises retirées ou livrées sont transférés au Client.</p>
      
      <h3>ARTICLE 3 - LA COMMANDE - VALIDATION DE COMMANDE</h3>
      <p>3.1. Les commandes sont effectuées sur le site internet www.sellerto.com.</p>
      <p>3.2. Les commandes peuvent également être effectuées par téléphone au 0767336979, numéros disponibles 7J/7 de 8h à 22h (Numéros gratuits, hors éventuels surcoûts de l'opérateur).</p>
      <p>3.3. Les commandes peuvent également être effectuées par tchat depuis le site internet www.sellerto.com tous les jours (hors 1er janvier, 1er mai, 25 décembre) de 8h à 20 heures.</p>
      <p>3.4. Les informations contractuelles sont présentées en langue française.</p>
      <p>3.5. Pour passer commande :</p>
      <ul>
        <li>Sur sellerto.com, le Client suit les différentes étapes de commande défilant sur le site, à savoir la sélection du ou des articles choisis via la rubrique "mon panier", l'identification Client par la rubrique "identification", les modalités et conditions de livraison par la rubrique "livraison", les modalités de paiement par la rubrique "paiement".</li>
      </ul>
      <p>L'attention du Client est particulièrement attirée sur le mode d'acceptation de la commande passée sur le site internet www.sellerto.com. Lorsque le Client passe sa commande il doit confirmer celle-ci par la technique du « double-clic », c’est-à-dire qu’après avoir sélectionné des produits ajoutés au panier, le Client doit contrôler et éventuellement corriger le contenu de son panier (identification, quantité de produits sélectionnés, prix, modalités et frais de livraison…) avant de le valider en cliquant sur « valider ma livraison », puis il reconnaît accepter les présentes CGV avant de cliquer sur le bouton « payer », enfin il valide sa commande après avoir rempli ses coordonnées bancaires. Le "double clic" vaut "signature électronique" et équivaut à une signature manuscrite. Il constitue une acceptation irrévocable et sans réserve de la commande par le Client. Sauf preuve contraire, les données enregistrées par SellerTo sur Internet ou par téléphone constituent la preuve de l'ensemble des transactions passées entre la société et ses clients.</p>
      <p>Les informations relatives à la commande (dont notamment le n° de la commande) font l'objet d'une confirmation par voie d'e-mail en temps utile et au plus tard au moment de la livraison/délivrance. SellerTo conseille vivement au Client d'imprimer et/ou d'archiver sur un support fiable et durable cet e-mail à titre de preuve. Une facture numérique est mise à la disposition du Client dans l'espace "mon compte". Là encore, SellerTo conseille vivement au Client d'imprimer et/ou d'archiver sur un support fiable et durable cette facture à titre de preuve.</p>
      <p>Par téléphone ou tchat, le Client suit les différentes étapes de commande, à savoir la sélection du ou des articles qu’il souhaite acheter (le Client doit communiquer la référence du produit qu’il souhaite acheter ou indiquer au conseiller le type de produit qu’il recherche), l’identification du Client (le Client doit fournir ses coordonnées), les modalités et conditions de livraison (le Client doit indiquer le mode de livraison qu’il souhaite utiliser), les modalités de paiement (le conseiller envoie une demande de paiement sécurisé par SMS ou email au Client) et la finalisation de la commande par le paiement de cette dernière.</p>
      <p>L'attention du Client est particulièrement attirée sur le mode d'acceptation de la commande passée via tchat ou téléphone. Lorsque le Client passe sa commande, il confirme celle-ci par l’acte de paiement. Par le paiement le Client reconnaît avoir accepté les CGV, le paiement constitue une acceptation irrévocable et sans réserve de la commande par le Client. Sauf preuve contraire, les données enregistrées par SellerTo sur Internet ou par téléphone constituent la preuve de l'ensemble des transactions passées entre la société et ses clients.</p>
      <p>Les informations relatives à la commande (dont notamment le n° de la commande) font l'objet d'une confirmation par voie d'e-mail en temps utile et au plus tard au moment de la livraison/délivrance. SellerTo conseille vivement au Client d'imprimer et/ou d'archiver sur un support fiable et durable cet e-mail à titre de preuve. Une facture sur support durable (format PDF) est envoyée par voie d’e-mail en temps utile et au plus tard au moment de la livraison/délivrance.</p>
      <p>3.6. Les informations communiquées par le Client lors de la passation de la commande (notamment nom et adresse de livraison) engagent celui-ci. Ainsi, la responsabilité de la société SellerTo ne saurait en aucune manière être recherchée dans l'éventualité où une erreur lors de la passation de la commande empêcherait ou retarderait la livraison/la délivrance.</p>
      <p>3.7. Le Client déclare avoir la pleine capacité juridique lui permettant de s'engager au titre des présentes conditions générales de vente.</p>
      
      <h3>ARTICLE 4 - DISPONIBILITE</h3>
      <p>Les offres de produits et de prix sont valables tant qu'elles sont visibles sur le site, dans la limite des stocks disponibles.</p>
      
      <h3>ARTICLE 5 - PAIEMENT</h3>
      <p>Les informations relatives à la carte de crédit du Client bénéficient du procédé de cryptage SSL. Ces informations sont directement adressées à la Banque de la société SellerTo, elles ne transitent donc pas et ne sont donc pas stockées sur les serveurs SellerTo.</p>
      
      <h3>ARTICLE 6 - LIVRAISON / DELIVRANCE</h3>
      <p>Les conditions de livraison et de délivrance sont indiquées sur le site au moment de la commande.</p>
      
      <h3>ARTICLE 7 - RETRACTATION</h3>
      <p>7.1. Principe</p>
      <p>Aux termes de l’article L.221-18 du code de la consommation, le Client dispose d'un délai de 14 jours calendaires pour exercer son droit de rétractation sans avoir à motiver sa décision.</p>
      <p>Ce délai court à compter du lendemain :</p>
      <ul>
        <li>de la réception de son produit</li>
        <li>de la conclusion du contrat, pour les contrats de prestation de service ou de fourniture de contenus numériques indépendamment de tout support matériel</li>
        <li>de la réception du premier produit, pour les contrats prévoyant la livraison régulière de biens pendant une période définie</li>
        <li>de la réception du dernier produit pour une commande portant sur plusieurs produits livrés séparément.</li>
      </ul>
      
      <p>7.2. Modalités d’exercice du droit de rétractation</p>
      <p>Pour exercer son droit de rétractation, le Client informe SellerTo de sa décision de se rétracter soit en adressant le formulaire type de rétractation en Annexe 1 des présentes Conditions Générales de Vente, soit en adressant toute déclaration dénuée d'ambiguïté exprimant sa volonté de se rétracter, avant l’expiration du délai de 14 jours mentionné à l’article 7.1 :</p>
      <ul>
        <li>par courrier à l’adresse Service client SellerTo, 210 avenue du 8 mai 1945, Le Blanc Mesnil,</li>
        <li>par email à l’adresse suivante : hamzamahmood93150@gmail.com. SellerTo accuse réception, sans délai, de la rétractation du Client par email.</li>
        <li>par téléphone au 0767336979, gratuits (hors éventuels surcoûts de l’opérateur) disponibles 7J/7 de 8h à 22h, en se munissant de son numéro de facture.</li>
      </ul>
      
      <p>7.3. Exceptions</p>
      <p>Au regard de l’article L.221-28 du code de la consommation, le droit de rétractation ne peut être exercé pour :</p>
      <ul>
        <li>les services pleinement exécutés avant la fin du délai de rétractation et dont l’exécution a commencé après l’accord exprès du Client et renoncement exprès à son droit de rétractation</li>
        <li>les biens confectionnés selon les spécifications du Client ou nettement personnalisés</li>
        <li>les biens susceptibles de se détériorer ou de se périmer rapidement</li>
        <li>les biens qui ont été descellés par le Client après la livraison et qui ne peuvent être renvoyés pour des raisons d’hygiène ou de protection de la santé</li>
        <li>les enregistrements audio ou vidéo, ou les logiciels informatiques lorsqu’ils ont été descellés par le Client après la livraison.</li>
        <li>les contenus numériques non fournis sur un support matériel dont l’exécution a commencé après accord exprès du Client et renoncement exprès à son droit de rétractation.</li>
      </ul>
      
      <p>7.4. Modalités de retour des articles</p>
      <p>Le Client dispose d’un délai de 14 jours calendaires à compter de la communication de sa décision de se rétracter pour retourner son article à SellerTo, dans un carton adapté, à l’adresse suivante :</p>
      <p>SAV SELLERTO<br>210 avenue du 8 mai 1945, Le Blanc Mesnil</p>
      <p>Les frais de retour sont à la charge du Client. Pour les articles qui ne peuvent être retournés par la Poste en raison de leur nature (article de plus de 30 kg), vous trouverez ci-dessous une estimation des frais de retour auprès d’un transporteur de votre choix.</p>
      <p>De droit commun, les marchandises voyagent aux risques et périls du Client et à ce titre, SellerTo conseille tout particulièrement au Client de prendre toutes les assurances appropriées pour couvrir ce risque et/ou toutes mesures appropriées pour une protection optimale du produit.</p>
      
      <p>7.5. Remboursement</p>
      <p>Le Client sera remboursé de la totalité des sommes versées, y compris les frais d’envoi (sauf si le Client a opté pour une méthode de livraison plus chère que la livraison standard normale), au plus tard dans les quatorze (14) jours à compter de la date à laquelle SellerTo est informée de la décision du Client de se rétracter.</p>
      <p>Le remboursement pourra être différé jusqu’à récupération des biens ou jusqu’à ce que le Client ait fourni une preuve de l’expédition de ces biens.</p>
      <p>Il sera effectué en utilisant le même moyen de paiement que celui utilisé par le Client pour la transaction initiale, sauf accord exprès du Client pour que le remboursement soit effectué par un autre moyen de paiement.</p>
      
      <h3>ARTICLE 8 - SECURISATION</h3>
      <p>Les informations relatives à la carte de crédit du Client bénéficient du procédé de cryptage SSL. Ces informations sont directement adressées à la Banque de la société SellerTo, elles ne transitent donc pas et ne sont donc pas stockées sur les serveurs SellerTo.</p>
      
      <h3>ARTICLE 9 - PROPRIETE INTELLECTUELLE</h3>
      <p>Tous les textes, commentaires, ouvrages, illustrations, images et photographies, marques et bases de données reproduits et intégrés sur le site SellerTo.com sont protégés, pour le monde entier, au titre notamment de la propriété intellectuelle et du droit d'auteur. A ce titre et conformément aux dispositions du code de la propriété intellectuelle, seule l'utilisation pour un usage privé est autorisée. Toute reproduction totale ou partielle du site SellerTo.com est strictement interdite.</p>
      
      <h3>ARTICLE 10 – LES GARANTIES</h3>
      <p>10.1. Garanties légales pour les biens et les biens comportant des éléments numériques</p>
      <p>Le consommateur dispose d'un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de conformité en cas d'apparition d'un défaut de conformité. Durant ce délai, le consommateur n'est tenu d'établir que l'existence du défaut de conformité et non la date d'apparition de celui-ci.</p>
      <p>Lorsque le contrat de vente du bien prévoit la fourniture d'un contenu numérique ou d'un service numérique de manière continue pendant une durée supérieure à deux ans, la garantie légale est applicable à ce contenu numérique ou ce service numérique tout au long de la période de fourniture prévue. Durant ce délai, le consommateur n'est tenu d'établir que l'existence du défaut de conformité affectant le contenu numérique ou le service numérique et non la date d'apparition de celui-ci.</p>
      <p>La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir toutes les mises à jour nécessaires au maintien de la conformité du bien.</p>
      <p>La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant sa demande, sans frais et sans inconvénient majeur pour lui.</p>
      <p>Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur bénéficie d'une extension de six mois de la garantie initiale.</p>
      <p>Si le consommateur demande la réparation du bien, mais que le vendeur impose le remplacement, la garantie légale de conformité est renouvelée pour une période de deux ans à compter de la date de remplacement du bien.</p>
      <p>Le consommateur peut obtenir une réduction du prix d'achat en conservant le bien ou mettre fin au contrat en se faisant rembourser intégralement contre restitution du bien, si :</p>
      <ul>
        <li>Le professionnel refuse de réparer ou de remplacer le bien</li>
        <li>La réparation ou le remplacement du bien intervient après un délai de trente jours</li>
        <li>La réparation ou le remplacement du bien occasionne un inconvénient majeur pour le consommateur, notamment lorsque le consommateur supporte définitivement les frais de reprise ou d'enlèvement du bien non conforme, ou s'il supporte les frais d'installation du bien réparé ou de remplacement</li>
        <li>La non-conformité du bien persiste en dépit de la tentative de mise en conformité du vendeur restée infructueuse</li>
      </ul>
      <p>Le consommateur a également droit à une réduction du prix du bien ou à la résolution du contrat lorsque le défaut de conformité est si grave qu'il justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n'est alors pas tenu de demander la réparation ou le remplacement du bien au préalable.</p>
      <p>Le consommateur n'a pas droit à la résolution de la vente si le défaut de conformité est mineur.</p>
      <p>Toute période d'immobilisation du bien en vue de sa réparation ou de son remplacement suspend la garantie qui restait à courir jusqu'à la délivrance du bien remis en état.</p>
      <p>Les droits mentionnés ci-dessus résultent de l'application des articles L. 217-1 à L. 217-32 du code de la consommation.</p>
      <p>Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d'un montant maximal de 300 000 euros, qui peut être porté jusqu'à 10 % du chiffre d'affaires moyen annuel (article L. 241-5 du code de la consommation).</p>
      <p>Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du code civil, pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est conservé ou à un remboursement intégral contre restitution du bien.</p>
      
      <p>10.2. Garanties légales pour les contenus numérique et les services numériques</p>
      <p>Le consommateur dispose d'un délai de deux ans à compter de la fourniture du contenu numérique ou du service numérique pour obtenir la mise en œuvre de la garantie légale de conformité en cas d'apparition d'un défaut de conformité. Durant un délai d'un an à compter de la date de fourniture, le consommateur n'est tenu d'établir que l'existence du défaut de conformité et non la date d'apparition de celui-ci.</p>
      <p>La garantie légale de conformité emporte obligation de fournir toutes les mises à jour nécessaires au maintien de la conformité du contenu numérique ou du service numérique.</p>
      <p>La garantie légale de conformité donne au consommateur droit à la mise en conformité du contenu numérique ou du service numérique sans retard injustifié suivant sa demande, sans frais et sans inconvénient majeur pour lui.</p>
      <p>Le consommateur peut obtenir une réduction du prix en conservant le contenu numérique ou le service numérique ou il peut mettre fin au contrat en se faisant rembourser intégralement contre renoncement au contenu numérique ou au service numérique, si :</p>
      <ul>
        <li>Le professionnel refuse de mettre le contenu numérique ou le service numérique en conformité</li>
        <li>La mise en conformité du contenu numérique ou du service numérique est retardée de manière injustifiée</li>
        <li>La mise en conformité du contenu numérique ou du service numérique ne peut intervenir sans frais imposés au consommateur</li>
        <li>La mise en conformité du contenu numérique ou du service numérique occasionne un inconvénient majeur pour le consommateur</li>
        <li>La non-conformité du contenu numérique ou du service numérique persiste en dépit de la tentative de mise en conformité du professionnel restée infructueuse</li>
      </ul>
      <p>Le consommateur a également droit à une réduction du prix ou à la résolution du contrat lorsque le défaut de conformité est si grave qu'il justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n'est alors pas tenu de demander la mise en conformité du contenu numérique ou du service numérique au préalable.</p>
      <p>Dans les cas où le défaut de conformité est mineur, le consommateur n'a droit à l'annulation du contrat que si le contrat ne prévoit pas le paiement d'un prix.</p>
      <p>Toute période d'indisponibilité du contenu numérique ou du service numérique en vue de sa remise en conformité suspend la garantie qui restait à courir jusqu'à la fourniture du contenu numérique ou du service numérique de nouveau conforme.</p>
      <p>Les droits mentionnés ci-dessus résultent de l'application des articles L. 224-25-1 à L. 224-25-31 du code de la consommation.</p>
      <p>Le professionnel qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d'un montant maximal de 300 000 euros, qui peut être porté jusqu'à 10 % du chiffre d'affaires moyen annuel (article L. 242-18-1 du code de la consommation).</p>
      <p>Le consommateur bénéficie, en outre, de la garantie légale des vices cachés en application des articles 1641 à 1649 du code civil, pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le contenu numérique ou le service numérique est conservé ou à un remboursement intégral contre renonciation au contenu numérique ou au service numérique.</p>
      
      <h3>ARTICLE 11 - TRAITEMENT DES DECHETS DES EQUIPEMENTS ELECTRIQUES ET ELECTRONIQUES.</h3>
      <p>En application de l’article L541-10-8 du Code de l’environnement, SellerTo propose la reprise gratuite de l’ancien appareil du Client, ainsi que ses consommables usagés (piles, cartouches d’encre, cartouches filtrantes…).</p>
      <p>Le Client a 4 possibilités :</p>
      <ul>
        <li>A domicile : Lors de la livraison d’un nouvel appareil (livraison de gros électroménagers et téléviseurs de plus de 101 cm), d’un meuble ou d’une cuisine par nos livreurs SellerTo. Etant précisé que les anciens meubles de cuisine devront être démontés et sécurisés (dépourvus de visserie saillante et dangereuse à la manutention). Les meubles devront être entièrement vidés, propres et mis à disposition de nos livreurs au rez-de-chaussée de l’habitation. Le démontage des meubles est à la charge du client. La reprise concerne uniquement les meubles de cuisine en bois, et ne concerne pas les plans de travail spécifiques (marbre, granit, céramique, corian.) qui resteront à la charge du Client.</li>
        <li>Via notre service client : Appelez le 0767336979. Le service client générera une étiquette retour valable en point relais ou en bureau de poste en cas d’achat d’un nouveau produit. Service gratuit, non applicable sur le gros électroménager et télévision de plus de 101 cm, qui seront repris lors de la livraison d’un nouvel appareil.</li>
        <li>En magasin : Dans le meuble de collecte à votre disposition ou au comptoir SAV.</li>
        <li>Dans l’un des points de collecte le plus proche de chez vous, rendez vous sur le site de notre partenaire Ecosystem pour les produits électriques ou électroniques ou sur le site de notre partenaire Ecomaison pour les meubles pour trouver les points de collecte.</li>
      </ul>
      <p>SELLERTO attire particulièrement l’attention du Client sur ses anciens appareils susceptibles de contenir des données personnelles. Il est ainsi recommandé au client de veiller dans la mesure du possible à effacer ses données avant remise ou dépôt.</p>
      <p>En application de l’article R 541-164 du Code de l’environnement SellerTo pourra refuser de reprendre un produit s’il présente un risque pour la santé et la sécurité du personnel.</p>
      
      <h3>ARTICLE 12 - SERVICE CLIENTELE</h3>
      <p>Pour toute question, information ou réclamation, le Service Clientèle est à la disposition du Client :</p>
      <ul>
        <li>par téléphone au 0767336979, numéros gratuits (hors éventuels surcoûts de l’opérateur), du lundi au dimanche (hors jours fériés) de 8 à 22 heures pour toute question relative ;</li>
        <li>par email à l’adresse suivante : hamzamahmood93150@gmail.com;</li>
        <li>par courrier à l'adresse suivante : Service Clientèle SellerTo, 210 avenue du 8 mai 1945, Le Blanc Mesnil.</li>
      </ul>
      
      <h3>ARTICLE 13 - DROIT APPLICABLE, LITIGES ET MEDIATION</h3>
      <p>13.1. Droit applicable</p>
      <p>Les présentes conditions générales de vente et le contrat de vente en ligne sont soumis au droit français.</p>
      
      <p>13.2. Litige et Médiation</p>
      <p>En cas de litige ou de réclamation, il est recommandé au Client de se rapprocher du Service Clientèle afin de rechercher et de trouver une solution amiable. Pour tout contact, reportez-vous à l'article 12 ci-avant.</p>
      <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, SellerTo adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) dont les coordonnées sont les suivantes : Médiateur de la consommation FEVAD BP 20015 - 75362 PARIS CEDEX 8 - https://www.mediateurfevad.fr. Après démarche préalable écrite du Client vis-à-vis de SellerTo, le Service du Médiateur peut être saisi pour tout litige de consommation dont le règlement n’aurait pas abouti. Pour connaître les modalités de saisine du Médiateur</p>
      <p>De plus, la Commission européenne a mis en place une plateforme de résolution des litiges destinée à recueillir les éventuelles réclamations de consommateurs faisant suite à un achat en ligne afin de les transmettre ensuite aux médiateurs nationaux compétents. Cette plateforme est accessible ici.</p>
      <p>A défaut d'accord amiable entre les Parties, le litige sera soumis aux Tribunaux français.</p>
      
      <h3>ARTICLE 14 - DONNEES PERSONNELLES</h3>
      <p>SellerTo, 210 avenue du 8 mai 1945, Le Blanc Mesnil, traite vos données personnelles en qualité de responsable du traitement à des fins de gestion de votre demande, de la relation client, et du service après-vente. Ce traitement est basé sur le contrat liant SellerTo au client.</p>
      <p>Sur le fondement de son intérêt légitime, SELLERTO peut également utiliser ces données à des fins :</p>
      <ul>
        <li>d’analyses statistiques</li>
        <li>d’enquêtes de satisfaction</li>
        <li>de prospection et d’amélioration de sa connaissance client</li>
      </ul>
      <p>Pour davantage d’information et de précisions sur le traitement de vos données personnelles par SellerTo, et notamment sur les durées de conservation de vos données</p>
      <p>Vous pouvez exercer l'ensemble des droits dont vous disposez en vertu de la Loi n° 78-17 du 6 janvier 1978 dite "Informatique et Libertés" (accès, rectification, effacement des données, limitation du traitement sur ces données, opposition à l’utilisation de ces données, portabilité de ces données, directives relatives au sort de ces données après votre décès) par courrier à l’adresse visée ci-dessus ou par email à l’adresse hamzamahmood93150@gmail.com. Conformément aux articles L.223-1 et suivants du code de la consommation, si vous ne souhaitez plus être démarché par téléphone sur le numéro communiqué à SellerTo vous pouvez inscrire à tout moment ce numéro de téléphone sur la liste d’opposition au démarchage téléphonique par Internet sur le site www.bloctel.gouv.fr.</p>
      <p>Vous disposez également du droit de formuler une réclamation auprès de la CNIL.</p>
      <p>Les données personnelles vous concernant sont destinées à SellerTo et à ses sous-traitants en charge de l’exécution des finalités visées ci-dessus. Vos données peuvent également être transmises par SELLERTO à des sociétés partenaires, telles que VALIUZ (qui réunit un ensemble d’enseignes de distribution autour de la connaissance client dans le but d’améliorer votre expérience et de personnaliser nos offres et notre communication en fonction de vos habitudes d’achat).</p>
      <p>Les données collectées par SELLERTO dans le cadre d'une commande sur le site internet sont communiquées à Oneytrust (responsable de traitement) et/ou Adyen (sous-traitant de SELLERTO) à des fins d'analyse et d'évaluation d'un niveau de confiance quant au caractère frauduleux de la commande. Vous êtes informé qu’un impayé lié à l’utilisation frauduleuse d'un moyen de paiement entraînera l'inscription des données liées à la commande associée au sein d'un fichier d'incidents de paiement mis en œuvre par SELLERTO. En savoir plus sur la gestion de vos données par Oneytrust et vos droits : https://oneytrust.com/recapitulatif-mentions-legales/mention-information-score-et-review/</p>
      
      <h3>ARTICLE 15 - CHAMP D'APPLICATION DES CONDITIONS PARTICULIERES DE VENTE</h3>
      <p>Les conditions du présent chapitre sont applicables uniquement au Client Internet, téléphone ou tchat ayant choisi de retirer le produit dans un des magasins SELLERTO de son choix.</p>
      <p>Hormis les dérogations et/ou précisions apportées dans ce présent chapitre, les autres dispositions des conditions générales de vente établies en chapitre I restent pleinement applicables à l'acte d'achat sur www.sellerto.com.</p>
      <p>Cette faculté de retirer la marchandise en magasin SellerTo, concerne uniquement les produits ayant l'option activable "retrait en Magasin". Les produits vendus par SELLERTO uniquement sur www.sellerto.com ne peuvent faire l'objet d'une réservation en magasin.</p>
      
      <h3>ARTICLE 16 - PRIX</h3>
      <p>Par dérogation à l'article 2 des conditions générales de vente ci-avant développées, le prix du(es) produit(s) et/ou service(s) commandé(s) ne se verra pas appliquer de frais de traitement et d'expédition.</p>
      
      <h3>ARTICLE 17 - LA COMMANDE - VALIDATION DE COMMANDE</h3>
      <p>Pour les commandes effectuées sur Internet :</p>
      <p>En dérogation à l'article 3.5 des conditions générales de vente ci-avant présentées, pour passer commande, le Client suit les différentes étapes de commande défilant sur le site, à savoir la sélection du ou des articles choisis par la rubrique "ma liste de réservation", l'identification Client par la rubrique "coordonnées", les modalités et conditions de livraison par la rubrique "livraison", les modalités de paiement par la rubrique "paiement" et la finalisation de la commande par la rubrique "confirmation".</p>
      <p>Dans le message de confirmation de commande tel que visé à l'article 3.6 ci-avant, le Client se verra indiquer une date de mise à disposition de sa commande dans le magasin qu'il aura choisi</p>
      <p>Le Client recevra un email et/ou un SMS au numéro qu’il aura indiqué lors de la validation de son mode de livraison pour l’informer de la disponibilité de son achat en magasin.</p>
      
      <p>Pour les commandes effectuées par téléphone ou par tchat :</p>
      <p>En dérogation à l'article 3.5 des conditions générales de vente ci-avant présentées, pour passer commande, le Client suit les différentes étapes de commande, à savoir la sélection du ou des articles choisis, l'identification Client, les modalités et conditions de livraison, les modalités de paiement et la finalisation de la commande par le paiement de cette dernière.</p>
      <p>Le Client se verra indiquer une date de mise à disposition de sa commande par le conseiller et sur le bon de commande envoyé par email au Client.</p>
      <p>Pour les commandes passées sur Internet, le Client recevra un email et/ou un SMS au numéro qu’il aura indiqué lors de la validation de son mode de livraison pour l’informer de la disponibilité de son achat en magasin.</p>
      <p>Pour les commandes passées par Téléphone ou par Tchat, et dont l’article ne serait pas immédiatement disponible en magasin, le Client recevra un SMS de mise à disposition dès réception de son article par le magasin choisi lors de sa commande.</p>
      
      <h3>ARTICLE 18 - MISE A DISPOSITION DE LA COMMANDE</h3>
      <p>18.1. A compter de l'émission du message informant le Client ou son représentant de la mise à disposition de son produit dans le magasin, le client dispose d’un délai de 30 jours calendaires pour retirer sa commande dans le magasin SELLERTO choisi.</p>
      <p>A défaut dans ce délai des 30 jours susvisés, d'être venu retirer la marchandise commandée ou d'avoir sollicité par écrit un report de retrait auprès du Service Clientèle, SellerTo s'autorise un rappel électronique de mise à disposition. A défaut de retrait ou d'information par le Client ou son représentant dans un nouveau délai de 30 jours à compter de l'émission de ce rappel, la commande sera résolue de plein droit. Le Client sera alors remboursé des sommes versées le cas échéant, dans un délai de 30 jours à compter de la date effective du paiement.</p>
      <p>18.2. Contrairement à l'article 3.6 ci-avant développé, pour les commandes passées sur www.sellerto.com, la facture de la commande sera remise au Client ou à son représentant par le magasin lors du retrait de la marchandise. Toutefois, un duplicata en version numérique restera disponible dans la rubrique "mon compte" du site.</p>
      <p>Pour les commandes passées par téléphone ou par tchat, la facture sera envoyée par email à l’adresse email communiquée par le Client lors de la commande et/ou remise au Client ou à son représentant par le magasin lors du retrait de la marchandise s’ils en font la demande.</p>
      
      <h3>ARTICLE 20 - PAIEMENT</h3>
      <p>Par dérogation à l'article 5 des conditions générales de vente, la commande est payable en totalité ou en partie (30% du montant de la commande) au jour de la commande.</p>
      <p>En cas de paiement partiel, le solde du prix de la commande est à régler obligatoirement au magasin préalablement au retrait de la marchandise.</p>
      <p>L’attention du Client est attirée sur le fait que les commandes par téléphone ou par tchat ne peuvent pas bénéficier du paiement partiel et doivent être payés en totalité lors de la commande.</p>
    `;
  } else if (contentType === 'data-protection') {
    state.title = 'Politique de Protection des Données';
    state.content = `
      <h2>Politique de Protection des Données</h2>
      <p>Voici notre politique de protection des données...</p>
      <!-- Ajoutez le contenu complet ici -->
    `;
  }
};

onMounted(loadContent);

watch(route, loadContent);
</script>

<template>
    <main>
  <div class="legal-content">
    <h1>{{ state.title }}</h1>
    <div v-html="state.content"></div>
  </div>
  </main>
</template>

<style>
td, th {
        border: 1px solid black;
        padding: 2px;
    }
</style>