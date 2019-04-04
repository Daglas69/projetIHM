function nom_Quest()
{
	let titre = document.getElementById("nomQuest");
	if (titre === undefined) return -1;
	else return titre.value;
}

function ajout_Quest()
{
	const titre = nom_Quest();
	let reponses = document.getElementById("reps").cloneNode(true);
	let pas_rempli = 0;
	for (child of reponses.children) //On compte le nombre de question pas remplies
	{
		if (child.children[1].children[0].value == "") pas_rempli++; 
	}
	
	/* Si des champs n'ont pas été renseignés correctement */
	if (!titre || reponses.children.length<2 || pas_rempli>0) {
		
		//Message d'erreur
		let message;
		if (!titre) message = "Le titre de la question n'a pas été renseigné \n\n";
		if (reponses.children.length<2) message = "La question doit contenir au moins 2 réponses \n\n";
		else message = "Tous les champs de réponses doivent être remplis";
		
		//Affichage de l'erreur
		swal({
			title: "ERRRREUR",
			text: message,
			icon: "error",
			buttons: { 
				oui: { text: "Je suis désolé", value: "excuse" },
				non: { text: "OK" }
			},
		})
		.then((value) => {
				switch(value) {
					case "excuse":
						swal({text: "bon toutou"});
						break;
				}
		});
		
		return -1;
	}
	
	/* Création d'un bloc question : fils du div prévu pour les questions du QCM */
	let questionsQCM = document.getElementById("QuestionsQCM");
	const i = questionsQCM.children.length;
	
	
	let question = document.createElement("div");
	question.setAttribute("class","questQCM "+i+" panel-group");
	question.setAttribute("id","accordion");
	
	/* Titre de la question */
	let blocTitre = document.createElement('div');
	blocTitre.setAttribute("class","row");
	const hrefInner = "#collapse"+i;
	blocTitre.innerHTML = 
		'<div class="panel-heading"> \
		  <div class="col-sm-6 panel-title" data-toggle="collapse" data-target="'+hrefInner+'"> \
		    <b><input type="text" value=" '+nom_Quest()+'" class="form-control input-md titreQCM"></b> \
	      </div> \
	  	  <div class="col-sm-2 col-sm-offset-4 text-right"> \
		    <button type="button" class="btn btn-danger" onclick="suppr_Quest('+i+')"><i class="glyphicon glyphicon-remove"></i></button> \
          </div> \
		<\div>';
	
	
	/* Bloc de réponses à la question */
 	let blocReponses = document.createElement("div");
	blocReponses.setAttribute("class","panel-collapse collapse");
	blocReponses.setAttribute("id","collapse"+i);	
	let collapsInner = document.createElement("div");
	collapsInner.setAttribute("class","panel-body");
	
	/* réponses à la question */
	reponses.removeAttribute("id"); //On enleve l'id
	reponses.setAttribute("class","reponseQCM");
	for(el of reponses.children) /* Boucle qui ne garde que l'input text des réponses (supprime croix et select) */
	{	
		nodes = el.children;
		nodes[0].classList.remove("col-sm-offset-1");
		nodes[2].remove(); //nodes[2] devient nodes[1] apres remove()
	}
	collapsInner.appendChild(reponses);
	blocReponses.appendChild(collapsInner);
	
	/* On ajoute le blocTitre et le blocQuestion à la question */
	question.appendChild(blocTitre);
	question.appendChild(blocReponses);
	
	/* On place le bloc parent dans le div contenant l'ensemble des questions */
	questionsQCM.appendChild(question);

	/* Message qui confirme l'ajout d'une question */
	let messageConfirm = document.createElement('div');
	messageConfirm.setAttribute("class","alert alert-success");
	messageConfirm.setAttribute("role","alert");
	messageConfirm.innerHTML = "La question a bien été ajoutée";
	questionsQCM.appendChild(messageConfirm);
	window.setTimeout(function() 
	{
		$(".alert").fadeTo(500, 0).slideUp(500, function(){
			$(this).remove(); 
		});
	}, 1000);
}

function ajout_Rep() 
{
	let blocReponses = document.getElementById("reps");
	const i = blocReponses.childNodes.length + 1; 
	let reponse = document.createElement('div');
	reponse.setAttribute("class","row vertical-align");
	reponse.innerHTML = 
			'<div class="col-sm-1 col-sm-offset-1 text-center"> \
				<label for="reponse"> \
					<input type="checkbox"> \
				</label>  \
			</div> \
			<div class="col-sm-3"> \
				<input type="text" id="rep'+i+'" name="reponse" value="" placeholder="Réponse" class="form-control input-md"> \
			</div> \
			<div class="col-sm-1"> \
					<a href="#" class="supprRep" \
						data-toggle="tooltip" \
						title="Supprimer cette réponse">\
						<span class="glyphicon glyphicon glyphicon-remove text-danger"></span>\
					</a> \
			</div> \
		</div>';
	blocReponses.appendChild(reponse);
	init_actions();
}

function suppr_Quest(i)
{
	document.getElementById("QuestionsQCM")
			.getElementsByClassName("questQCM "+i)[0]
			.remove();
}

const suppr_Rep = croix => () => {
	document.getElementById("reps")
		.removeChild(croix.parentNode.parentNode);
}

function searchWord() //Ne cherche pas dans les inputs ...
{
	const str = document.getElementById("searchTxt").value;
	let nbSearch = 0;
	let txt, i, found;
	if (str=="") return false;
	 
	if ((document.layers)||(window.sidebar)) {
		if (!window.find(str)) {
		alert("Fin de page atteinte.\n"+'"'+str+'" trouvé '+nbSearch+" fois.");
		while(window.find(str, false, true)) {nbSearch++;}
		} 
		else nbSearch++;
		if (nbSearch == 0) alert('"'+str+'" est introuvable');
	}
	 
	if (document.all) {
		txt = window.document.body.createTextRange();
		for (i = 0; i <= nbSearch && (found = txt.findText(str)) != false; i++) {
			txt.moveStart("character", 1);
			txt.moveEnd("textedit");
		}
		if (found) {
			txt.moveStart("character", -1);
			txt.findText(str);
			txt.select();
			txt.scrollIntoView();
			nbSearch++;
		} 
		else {
			if (nbSearch > 0) {
				alert("Fin de page atteinte.\n"+'"'+str+'" trouvé '+nbSearch+" fois.");
	 
				nbSearch = 0;
				findInPage(str);
		  } 
		  else { 
			alert('"'+str+'" est introuvable');
		  }
		}
	 }
	 
	return false;
}	

function valider_QCM() 
{
	//Vérification
	swal({
	  title: "Voulez vous valider votre QCM ?",
	  text: "Une fois validé, vous ne pourrez plus le modifier.",
	  icon: "warning",
	  buttons: {
		cancel: "annuler",
		valid: "valider"
	  }
	})
	.then((valider) => {
	  if (valider) {
		swal("Votre QCM a bien été validé", {
		  icon: "success",
		});
		afficher_QCM();
	  }
	  else {
		return; //On annule la validation
	  }
	});
}

function afficher_QCM()
{
	let section = document.getElementById("section");
	let questionsQCM = document.getElementById("QuestionsQCM");	
	
	let blocQuestion = document.createElement("div");
	blocQuestion.setAttribute("id", "blocQuest-valide");
	
	//On a voulu se compliquer la tache et rendre notre code pas du tout adaptatif hehe
	let i = 1;
	for (question of questionsQCM.children) 
	{
		let titre = question.children[0].children[0].children[0].children[0].children[0].value; 
		
		let reponses = question.children[1].children[0].children[0].children;
		let tabReponses = [];
		for (reponse of reponses)
		{
			tabReponses.push(reponse.children[1].children[0].value);
		}
		
		let questHTML = document.createElement("div");
		questHTML.setAttribute("class", "question-valide");
		questHTML.innerHTML = `<h3>Question ${i}: ${titre}</h3><br/>${formate_Reps(tabReponses)}`;
		blocQuestion.appendChild(questHTML);
		i++;
	} 
	
	section.innerHTML = ""; //On supprime le contenu de la page
	
	/* Bouton export pdf */
	let bouton = document.createElement("div");
	bouton.setAttribute("id","btn-export-valide");
	bouton.innerHTML = 
			`<div class="row">
				<div class="col-sm-12 text-center">
					<button type="button" onclick="export_pdf()" class="btn btn-success">Exporter en pdf</button>
				</div>
			</div>`;	
	section.appendChild(bouton);	
	
	/* bloc de questions */
	section.appendChild(blocQuestion);
}

const formate_Reps = tab => {
	return tab.map(n => `<ul class="rep-valide"> <input type="checkbox"> ${n} </ul>`).join("<br/>");
}

const export_pdf = () => {
	const filename  = 'QCM.pdf';
	const QCM = document.getElementById("blocQuest-valide");
	html2pdf(QCM).save(filename);
}

function init_actions()
{
	/* Charge les boutons croix pour supprimer une réponse */
	let tabCroix = document.getElementsByClassName("supprRep");
	for (i =0; i<tabCroix.length; ++i)
	{
		croix = tabCroix[i];
		croix.onclick = suppr_Rep(croix);
	}
	
	/* Empeche de revenir en top de page après click d'une balise a */
	$('a[href$="#"]').click(function(e) {
    //Annule l"action par defaut
    e.preventDefault();
	});
	
	/* Garde le focus sur le bloc création question lors de l'ajout */
	$('#addQuest').click(function(e) {
	 e.preventDefault();
	 $("html, body").animate({ scrollTop: $(document).height() }, 1);
	});
	
	/* Tooltip de la page */
	$('[data-toggle="tooltip"]').tooltip();
}


$(document).ready(function(){
  init_actions();
});
	
