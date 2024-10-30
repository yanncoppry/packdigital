document.getElementById('siret').addEventListener('input', function() {
  const siret = this.value;
  const apiKey = '40230502-82f6-324f-a499-8f7dd036f45a';

  if (siret.length === 14) {
      // Appel à l'API INSEE pour récupérer les informations de l'entreprise
      fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${apiKey}`
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.etablissement) {
              const companyData = data.etablissement;

              // Remplir les champs du formulaire avec les données récupérées
              document.querySelector('input[id="company-name"]').value = `${companyData.uniteLegale.denominationUniteLegale || ''} ${companyData.uniteLegale.prenom1UniteLegale || ''} ${companyData.uniteLegale.nomUniteLegale || ''}`.trim();
              document.querySelector('input[id="company-address"]').value = companyData.adresseEtablissement.numeroVoieEtablissement + ' ' + companyData.adresseEtablissement.typeVoieEtablissement + ' ' + companyData.adresseEtablissement.libelleVoieEtablissement;
              document.querySelector('input[id="company-zip"]').value = companyData.adresseEtablissement.codePostalEtablissement;
              document.querySelector('input[id="company-city"]').value = companyData.adresseEtablissement.libelleCommuneEtablissement;
              document.querySelector('input[id="company-ceo"]').value = `${companyData.uniteLegale.sexeUniteLegale || ''} ${companyData.uniteLegale.prenom1UniteLegale || ''} ${companyData.uniteLegale.nomUniteLegale || ''}`.trim();
              document.querySelector('input[id="company-naf"]').value = companyData.uniteLegale.activitePrincipaleUniteLegale;
          } else {
              console.error('Aucune entreprise trouvée pour ce SIRET.');
          }
      })
      .catch(error => {
          console.error('Erreur lors de la récupération des données', error);
      });
  }
});



jQuery("input.hidden").parent(".formControls").parent().addClass("hidden");
// CHECKBOX ICONED 

jQuery("input.iconed").parent().addClass("iconify");
jQuery("input.number").parent("label").parent().addClass("numberify");


// CHECKMARK

jQuery("input[type=checkbox]:checked, input[type=radio]:checked")
.next("label").addClass("checked");


jQuery('input[type=checkbox]').change(function(){
  if(jQuery(this).is(":checked")) {
      jQuery(this).next("label").addClass("checked");
      jQuery(this).next().parent().parent().parent().addClass("hideme");
  } else {
      jQuery(this).next("label").removeClass("checked");
  }
});

jQuery('input[type=radio]').change(function(){
  if(jQuery(this).is(":checked")) {

      jQuery(this).parent().parent().parent().find('label').removeClass("checked");
      jQuery(this).parent("label").addClass("checked");
      jQuery(this).parent().parent().parent().parent().parent().addClass("hideme");
  } else {
      jQuery(this).parent("label").removeClass("checked");
  }
});

// TOGGLE-SWITCH
jQuery(".toggle-switch__input").parent(".form-check").addClass("toggle");
jQuery(".toggle-switch__input").next("label").addClass("toggle-switch");


jQuery(".toggle-switch .checkzone").remove();
jQuery(".toggle-switch__input + .feedback").remove();
jQuery(".toggle-switch__input").after('<span class="toggle-switch__slider"></span>');


// Initialisation de SignaturePad
var canvas = document.getElementById('ceo-signature');
var signaturePad = new SignaturePad(canvas);

// Fonction pour mettre à jour la signature en base64 à chaque mouvement
function updateSignature() {
if (!signaturePad.isEmpty()) { // Vérifie que le pad n'est pas vide
  var signatureDataURL = signaturePad.toDataURL(); // Conversion de la signature en base64
  document.getElementById('signature').value = signatureDataURL; // Mise à jour du champ "signature"
} else {
  document.getElementById('signature').value = ''; // Vide le champ si le pad est vide
}
}

// Fonction pour effacer la signature
function clearSignature() {
signaturePad.clear(); // Efface le canvas
document.getElementById('signature').value = ''; // Vide le champ "signature"
}

// Événements de SignaturePad pour mise à jour
canvas.addEventListener('mouseup', updateSignature);
canvas.addEventListener('touchend', updateSignature);
canvas.addEventListener('mousemove', updateSignature); // Ajout pour capturer les mouvements
canvas.addEventListener('touchmove', updateSignature); // Ajout pour capturer les mouvements tactiles

// Gestion de l'effacement avec le bouton "clear-signature"
document.getElementById('clear-signature').addEventListener('click', clearSignature);