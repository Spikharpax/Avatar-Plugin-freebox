freebox
=======

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Contrôle de la freebox Révolution de Free 


## Installation
- Dézippez le fichier `Avatar-Plugin-freebox-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `freebox` dans le répertoire `Avatar-Serveur/plugins`


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/freebox/freebox.prop`

### Le code télécommande
Placez dans la propriété `remoteController_code` le code télécommande de la freebox.

Retrouvez le code télécommande dans le menu système de la freebox.

```xml
"remoteController_code": "93360526",
```	

*
### Le jeton freebox
Nécessaire pour que le plugin sache si la freebox est allumée ou éteinte.

**Important**: Cette version n'inclut pas la création d'un jeton freebox serveur.

Vous pouvez utiliser le plugin [freebox](https://github.com/Spikharpax/SARAH-Plugin-freebox) disponible sur ce github pour générer le jeton avec l'assistant vocal [S.A.R.A.H.](http://encausse.net/s-a-r-a-h)

Si vous n'ajoutez pas de jeton, seules les commandes qui ne vérifient pas si la freebox est allumée ou éteinte fonctionneront. Vous pouvez aussi supprimer les fonctions de contrôle dans ces commandes du fichier js du plugin pour qu'elle puissent fonctionner sans.

Si vous disposez d'un jeton, ajoutez les informations dans les propriétés comme ci-dessous:
```xml
"app_token": "4rqfacr3dltsSB81KKlt67q8/FTCsyCCRnJUtRzYZIvdmNWjWYumq8OKG/slMQxs",
"app_id": "sarah.freeboxOS",
"app_version": "0.0.1",
```	

### Les chaines
Vous pouvez définir les chaines qui peuvent être dictées dans l'objet "channels".

A gauche, le numéro de chaine, à droite, le tableau de syntaxe des règles associées.

Par exemple, je veux pouvoir mettre la chaine TF1 en disant n'importe quelle règle qui contient le mot "TF1":
```xml
"channels" : {
	"1" : ["tf1","mytf1","MyTF1","TF1"],
```	

Plusieurs résultats de traduction sont possibles, j'ai donc plusieurs syntaxes possibles pour TF1.


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
Avatar inclut automatiquement ce plugin dans la gestion des règles vocales. 

Lorsqu'un dialogue est activé (speak et askme), le son de le freebox peut-être automatiquement coupé afin de réduire les possibilités d'incompréhension. Après l'exécution de la règle, le son est remit automatiquement.



   
## Versions
Version 1.1 (03-11-2017)
- Les fichiers intent et action déplacés dans le répertoire du plugin. Chargés automatiquemet (Avatar serveur 0.1.5)

Version 1.0 
- Version Released
