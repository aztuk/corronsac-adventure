# Fuse

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.5.

## 19/02

### Mécaniques

* Les dégâts de base du poison ont été grandement réduits
* Les taunts ne durent plus que 1 tour au lieu de 3

### Equipement

* Tous les équipements donnent maintenant une stat supplémentaire
* Les équipements donnant de l'esquive ont été divisé par 2

### Enemis

* Tous les enemis scalent maintenant en fonction de l'étage auquel il est rencontré. Une petite racaille à l'étage 1 aura ainsi par exemple 12PV et 2 attaques à l'étage 1 mais 88 et 15 attaque à l'étage 18 (+35% stats / étage)
* L'amant invoqué par Sandie passe de 30 à 95 points de vie
* Les conseillers municipaux voient leurs points de vie passer de 40 à 80 et leur attaque de 5 à 10

### Héros

* Quentin: Les dégâts de Quentin ont été légèrement augmentés pour égaler ceux atteints par Loic et Kevin
* Clément: Entrainement soigne désormais l'allié le plus faible
* Clément: Entrainement donne maintenant +5 attaque à tous ces alliés
* Clément: Les soins de Séductions sont passés de 8% à 4% de la santé max
* Clément: Les soins de Jonglages sont passés de 5% à 3% de la santé max
* Adrien: Nouveau passif. Adrien emmagazine maintenant les dégâts qu'il subit pour renvoyer la totalité à sa cible à la prochaine attaque, ou la cible suivante si celle ci meurt.
* Adrien: Escalade a été modifié pour infligé 120% de l'attaque à sa cible plus 120% pour chaque adversaire vivant
* Costy: Gagner 1 PV Max nécessite maintenant un total de 10 PV soigné au lieu de 15

### Bugs

* L'achat d'équipement en boutique ne donnait pas les bonus sur les sorts
* Tuer une cible avec le passif d'adrien renvoyait une erreur


## Todo

* Passif de Costy : ne pas compter les soins dans le vide ?
* Passif de Costy : Possibilité de monter de plusieurs HP en un tour
* Mettre animation fumée sur les effets
* Stats service (ajouter les DOTS dans le compte, tableau séparé)

