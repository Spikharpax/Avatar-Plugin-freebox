freebox
=======

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Gestion de la freebox Révolution de Free 

![GitHub Logo](/logo/Freebox-Revolution.jpg)

<BR>


## Installation
- Dézippez le fichier `Avatar-Plugin-freebox-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `freebox` dans le répertoire `Avatar-Serveur/plugins`


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/freebox/freebox.prop`

### Le code télécommande
Placez dans la propriété `remoteController_code` le code télécommande de la freebox.

Retrouvez le code télécommande dans le menu système de la freebox.

```xml
"remoteController_code": "93368926",
```	

### Accès à la Freebox
Nécessaire pour que le plugin sache si la freebox est allumée ou éteinte.

**Important**: Cette version inclut la création d'un accès à la Freebox.

Si vous n'ajoutez pas de jeton, seules les commandes qui ne vérifient pas si la freebox est allumée ou éteinte fonctionneront. Vous pouvez aussi supprimer les fonctions de contrôle dans ces commandes du fichier js du plugin pour qu'elle puissent fonctionner sans.

Si vous disposez d'un accès, ajoutez vos informations dans les propriétés du plugin comme l'exemple ci-dessous:
```xml
"auth" : {
	"app_id": "Avatar.freebox",
	"app_version": "0.0.1",
	"app_name": "Freebox for Avatar",
	"device_name"	: "Avatar Server",
	"app_token": "4rqfacrJJJtySB81KKlkUgq8/FTCsyCCRnJUtRzYZIvdmNWjWYumq8OKG/slMQxs",
	"track_id": "3"
},
```	

#### Créer un accès à la Freebox
- Ouvrez une fenetre de commandes MS-DOS
	- Menu `Démarrer` -> entrez `cmd`
- Déplacez-vous dans le répertoire du plugin 
	- cd `<Freebox>/lib`
- Exécutez le programme de création de l'accès
	- FreeAuthenticate.bat
	
Suivez les instructions à l'écran.

Le fichier freebox.prop est automatiquement mis à jour avec la clé créée.

Vous devez ensuite vérifier dans l'interface de gestion de votre Freebox la création de la clé:
- Ouvrez votre interface de gestion dans un navigateur internet
	- mafreebox.freebox.fr/login.php
	- Dans les paramètres de gestion de la Freebox, allez dans la section `Divers` puis `Gestion des accès`
	- Cliquez sur l'onglet `Applications`
	- L'application `Freebox for Avatar` doit se trouver dans la liste
	- Cliquez sur l'icone `Editer`
	- Visualisez les droits d'accès
	- Cliquez sur `OK`
	
Après avoir redémarré Avatar pour que le fichier de propriétés du plugin soit rechargé, vous pouvez tester l'utilisation en dictant la règle `Allume la Freebox`
	
	
### Les chaines
Vous pouvez définir les chaines qui peuvent être dictées dans l'objet "channels".

A gauche, le numéro de chaine, à droite, le tableau de syntaxe des règles associées.

Par exemple, je veux pouvoir mettre la chaine TF1 en disant n'importe quelle règle qui contient le mot "TF1":
```xml
"channels" : {
	"1" : ["tf1","mytf1","MyTF1","TF1"],
```	

Plusieurs résultats de traduction sont possibles, dans l'exemple ci-dessus, il y a donc plusieurs syntaxes possibles pour TF1.


### Les commandes
Toutes les syntaxes de phrases qui comprennent ces mots peuvent être utilisées. Ce ne sont pas des règles fixes.

Les règles sont définies dans les tableaux suivants:
- "rules" : Toutes les commandes de gestion de la freebox
- "channels" : Voir ci-dessus pour l'explication.

Les régles possibles que vous pouvez passer à Avatar:
- "En arrière" : Retourne sur la chaine précédente 
- "Chaine précédente" : Affiche la chaine précédente dans la liste des chaines
- "Chaine suivante" : Affiche la chaine suivante dans la liste des chaines
- "Allume la freebox" : Met la freebox sur On si elle est éteinte.
- "Eteint la freebox" : Met la freebox sur Off si elle est allumée.
- "Chaines favorites" : Met le bouquet "chaines favorites", si la freebox est éteinte, elle est allumée.
- "Enregistrement de la freebox" : Met les enregistrements, si la freebox est éteinte, elle est allumée.
- "Toutes les chaines" : Met le bouquet "toutes les chaines", si la freebox est éteinte, elle est allumée.
- "vidéos de la freebox" : Met les vidéos, si la freebox est éteinte, elle est allumée.
- "home de la freebox" : Met la home de la freebox, si la freebox est éteinte, elle est allumée.
- "Baisse un peu le son" : Baisse un peu le volume de la freebox
- "Baisse le son" : Baisse beaucoup le volume de la freebox
- "Monte un peu le son" : Monte un peu le volume de la freebox
- "Monte le son" : Monte beaucoup le volume de la freebox
- "Fais le silence" : Coupe (Mute) le volume de la freebox


### Supplément
Il est possible d'associer une phrase à la règle de changement de chaines.

Ces associations "Chaine"/"Phrase" sont définies dans l'objet "tts_action" du fichier de propriétés.

Par exemple:
- Pour la chaine TF1, je veux que Avatar me dise :  "Je met TF1"
```xml
"tts_action" : {
	"1" : "je mets tf1",
```	

### Intégration avec Avatar
Avatar inclut automatiquement ce plugin dans la gestion du son pour les règles vocales. 

Lorsqu'un dialogue est activé (speak et askme), le son de le freebox est automatiquement coupé afin de réduire les possibilités d'incompréhension. Après l'exécution de la règle, le son est remit automatiquement.


## Versions
Version 1.2 (03-02-2018)
- Ajout de la création automatique de la clé d'accès à la Freebox
- Prise en compte du client Android
	- Ajout d'actions pouvant être exécutées depuis le munu navigateur du smartphone
- Modification de quelques règles vocales

Version 1.1 (03-11-2017)
- Les fichiers intent et action déplacés dans le répertoire du plugin. Chargés automatiquement (Avatar serveur 0.1.5)

Version 1.0 
- Version Released
