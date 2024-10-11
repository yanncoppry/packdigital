(function() {
  // Réinitialise les validations pour les champs d'un fieldset
  function resetValidation(fieldset) {
    var elements = fieldset.querySelectorAll("input, select, textarea");
    elements.forEach(function(elem) {
      elem.classList.remove('is-invalid', 'is-valid'); // Enlève les classes de validation
    });

    // Supprime les messages de feedback
    var feedbackMessages = fieldset.querySelectorAll('.feedback');
    feedbackMessages.forEach(function(message) {
      message.remove();
    });
  }

  // Crée un message de feedback et l'affiche sous l'élément
  function createMessage(elem, messageArr, type) {
    var messageEl = document.createElement('div'); // Crée un nouvel élément div
    var messageText = messageArr.join(', '); // Combine les messages en une seule chaîne
    messageEl.classList.add(type + '-feedback', 'feedback'); // Ajoute des classes pour le style
    messageEl.textContent = messageText; // Définit le texte du message
    elem.parentNode.insertBefore(messageEl, elem.nextSibling); // Insère le message après l'élément
  }

  // Définit les champs invalides et gère l'activation du bouton de soumission
  function setInvalidFields(fieldset, validationResult) {
  var mySubmit = fieldset.querySelector('.btn');
  var elements = fieldset.querySelectorAll('input, select, textarea');
  var hasErrors = false; // Flag pour suivre les erreurs

  elements.forEach(function(elem) {
    var name = elem.name;

    // Supprime les anciennes classes et messages
    elem.classList.remove('is-invalid', 'is-valid');
    var existingFeedback = elem.parentNode.querySelector('.feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // Vérifie si l'élément a été modifié et s'il a des résultats de validation
    if (elem.hasAttribute('data-dirty')) {
      if (elem.value === '' && constraints[name]?.presence) {
        // Champ vide, afficher le message "required"
        elem.classList.add('is-invalid');
        createMessage(elem, [constraints[name].presence.message || "Ce champ est requis"], 'invalid');
        hasErrors = true; // Marquer qu'il y a une erreur
      } else if (validationResult && validationResult[name]) {
        // Si une erreur de validation est trouvée
        elem.classList.add('is-invalid');  
        createMessage(elem, validationResult[name], 'invalid');
        hasErrors = true;
      } else if (elem.value !== '') {  // Ajout de cette condition
        // Champ valide uniquement s'il n'est pas vide
        elem.classList.add('is-valid');
        var successMessage = getSuccessMessage(name);
        createMessage(elem, [successMessage || "Valid"], 'valid');
      }
    }
  });

  // Active ou désactive le bouton de soumission
  if (mySubmit) {
    mySubmit.disabled = hasErrors;
  }
}


  // Obtient le message de succès en fonction des contraintes
  function getSuccessMessage(name) {
    var constraint = constraints[name];
    if (constraint) {
      if (constraint.format?.successmessage) {
        return constraint.format.successmessage;
      } else if (constraint.length?.successmessage) {
        return constraint.length.successmessage;
      }
    }
    return "Valid"; // Message par défaut
  }

  // Convertit les données du formulaire en objet JSON
  function toJSONString(fieldset) {
    var obj = {};
    var elements = fieldset.querySelectorAll("input, select, textarea");
    elements.forEach(function(element) {
      var name = element.name;
      var value = element.value;

      if (name) {
        obj[name] = value; // Ajoute la valeur à l'objet
      }
    });
    return obj; // Retourne l'objet JSON
  }

  // Fonction de validation du formulaire
  async function validateFieldset(fieldset) {
    var formData = toJSONString(fieldset);
    var validationResult = validate(formData, constraints); // Validation avec validate.js
    resetValidation(fieldset); // Réinitialise les validations
    setInvalidFields(fieldset, validationResult); // Définit les champs invalides

    // Validation spécifique pour le champ SIRET
    if (formData.siret) {
      await validateSiret(formData.siret, fieldset);
    }
  }

  // Validation spécifique pour le SIRET via l'API
  async function validateSiret(siret, fieldset) {
    var mySubmit = fieldset.querySelector('.btn');
    const siretField = fieldset.querySelector('#siret'); // Récupère le champ SIRET

    // Réinitialise les classes pour le champ SIRET
    siretField.classList.remove('is-invalid', 'is-valid'); // Enlève les anciennes classes

    if (siret.length === 14) {
      try {
        const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer c58eb61f-d2c5-38f5-96a1-bb38e5f61faa',
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });

        if (response.ok) {
          const data = await response.json();
          const etablissement = data.etablissement;
          const uniteLegale = etablissement.uniteLegale;

          // Remplir les champs avec les données de l'entreprise
          document.getElementById('company-name').value = `${uniteLegale.denominationUniteLegale || ''} ${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim();
          document.getElementById('company-address').value = `${etablissement.adresseEtablissement.numeroVoieEtablissement || ''} ${etablissement.adresseEtablissement.typeVoieEtablissement || ''} ${etablissement.adresseEtablissement.libelleVoieEtablissement || ''}`.trim();
          
          
          
          document.getElementById('company-zip').value = etablissement.adresseEtablissement.codePostalEtablissement || '';
          document.getElementById('company-city').value = etablissement.adresseEtablissement.libelleCommuneEtablissement || '';
          document.getElementById('company-ceo').value = `${uniteLegale.sexeUniteLegale || ''} ${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim();
          
          
          
          document.getElementById('company-naf').value = etablissement.uniteLegale.activitePrincipaleUniteLegale || '';

          // Message de succès pour le SIRET
          createMessage(siretField, [`${uniteLegale.denominationUniteLegale || ''} ${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`], 'valid');
          siretField.classList.add('is-valid'); // Ajoute la classe is-valid
          mySubmit.disabled = false; // Active le bouton submit
        } else {
          // Si le SIRET n'est pas trouvé, afficher une erreur
          siretField.classList.add('is-invalid'); // Ajoute la classe is-invalid
          createMessage(siretField, ['SIRET non trouvé'], 'invalid');
          resetFields(); // Réinitialise les champs
          mySubmit.disabled = true; // Désactive le bouton submit
        }
      } catch (error) {
        console.error('Erreur lors de la requête à l\'API', error);
        siretField.classList.add('is-invalid'); // Ajoute la classe is-invalid
        createMessage(siretField, ['Erreur lors de la vérification du SIRET'], 'invalid');
        resetFields(); // Réinitialise les champs
        mySubmit.disabled = true; // Désactive le bouton submit
      }
    } else {
      siretField.classList.add('is-invalid'); // Ajoute la classe is-invalid
      createMessage(siretField, ['Le SIRET doit contenir 14 chiffres'], 'invalid');
      resetFields(); // Réinitialise les champs
      mySubmit.disabled = true; // Désactive le bouton submit
    }
  }

  // Réinitialise les champs liés à l'entreprise
  function resetFields() {
    document.getElementById('company-name').value = '';
    document.getElementById('company-address').value = '';
    document.getElementById('company-zip').value = '';
    document.getElementById('company-city').value = '';
    document.getElementById('company-ceo').value = '';
    document.getElementById('company-naf').value = '';
  }

  // Initialisation de la validation
  function initValidation(form) {
    var fieldsets = form.querySelectorAll('fieldset');
    fieldsets.forEach(function(fieldset) {
      fieldset.addEventListener('keyup', function() {
        validateFieldset(fieldset); // Valide le fieldset lors de la saisie
      });

      fieldset.addEventListener('change', function(ev) {
        ev.target.setAttribute('data-dirty', 'true'); // Marque le champ comme modifié
        validateFieldset(fieldset); // Valide le fieldset lors du changement
      });
    });
  }

  // Contraintes de validation
  var constraints = {
    name: {
      presence: { message: "Le nom est requis" },
      format: {
        pattern: /^[a-zA-Z]+ [a-zA-Z]+$/,
        message: "Ce champ doit contenir votre Nom et votre Prénom",
        successmessage: "Nom Complet valide"
      }
    },
    address: {
      presence: { message: "L'adresse est requise" },
      length: {
        minimum: 2,
        message: "doit avoir au moins 2 caractères",
        successmessage: "Adresse valide"
      }
    },
    zipcode: {
      presence: { message: "Le code postal est requis" },
      
      format: {
        pattern: /^[0-9]{5}$/,
        message: "doit contenir uniquement des chiffres",
        successmessage: "Code postal valide"
      }
    },
    city: {
      presence: { message: "La ville est requise" },
      length: {
        minimum: 2,
        message: "doit avoir au moins 2 caractères",
        successmessage: "Ville valide"
      }
    },
    email: {
      presence: { message: "L'email' est requis" },
      format: {
        pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "n'est pas valide",
        successmessage: "Email valide"
      }
    },
    phone: {
      presence: { message: "Le numéro de téléphone est requis" },
      format: {
        pattern: /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/,
        message: "n'est pas valide",
        successmessage: "Numéro de téléphone valide"
      }
    },
    siret: {
      presence: { message: "Le SIRET est requis" },
      length: { 
        is: 14, 
        message: "doit contenir 14 chiffres",
        successmessage: "Le format du Siret est valide"
      }
    }
  };

  // Événement de soumission du formulaire
  document.querySelector('form').addEventListener('submit', function(ev) {
    ev.preventDefault(); // Empêche la soumission du formulaire par défaut
    var fieldset = ev.target.querySelector('fieldset');
    validateFieldset(fieldset); // Valide le fieldset lors de la soumission
  });

  // Initialisation
  initValidation(document.querySelector('form')); // Initialise la validation pour le formulaire
})();


// CHECKBOX ICONED 

$("input.iconed").parent("label").parent().addClass("iconify");
$("input.number").parent("label").parent().addClass("numberify");


// CHECKMARK

jQuery("input[type=checkbox]:checked, input[type=radio]:checked")
  .parent("label").addClass("checked");


jQuery('input[type=checkbox]').change(function(){
    if(jQuery(this).is(":checked")) {
        jQuery(this).parent("label").addClass("checked");
        jQuery(this).parent().parent().parent().parent().addClass("hideme");
    } else {
        jQuery(this).parent("label").removeClass("checked");
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
 jQuery(".toggle-switch__input").parent("label").addClass("toggle-switch");

 jQuery(".toggle-switch .checkzone").remove();
 jQuery(".toggle-switch__input + .feedback").remove();
 jQuery(".toggle-switch__input").after('<span class="toggle-switch__slider"></span>');



const canvas = document.getElementById('signature');
const signaturePad = new SignaturePad(canvas);

// Bouton pour effacer la signature
document.getElementById('clear-signature').addEventListener('click', function () {
  signaturePad.clear();
});

document.getElementById('fieldset2').addEventListener('submit', function (event) {
  event.preventDefault();  // Empêcher l'envoi du formulaire
  if (!signaturePad.isEmpty()) {
    // Sauvegarder la signature en base64
    const signatureData = signaturePad.toDataURL(); 
    console.log("Signature enregistrée : ", signatureData);
    
    // Tu peux maintenant envoyer la signature au serveur
  } else {
    alert("Veuillez signer avant de soumettre le formulaire.");
  }
});


