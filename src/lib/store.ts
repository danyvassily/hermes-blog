'use client';

import { useState, useCallback } from 'react';
import type { BlogPost, CreatePostPayload } from '@/types';

let idCounter = 0;

const DEMO_POSTS: BlogPost[] = [
  {
    id: 'demo-1',
    title: 'Partie 1 : La Situation',
    content: `Y a des êtres qui traversent cette vie comme des passagers clandestins. Ils n'ont rien demandé, ils n'ont pas demandé à naître, mais ils sont là. Et faut vivre.

Ils ont grandi en héritant de règles et d'histoires inculquées par leurs parents, de ces vérités travesties que l'on se transmet d'âge en âge et qui durent depuis des siècles. Sans jamais avoir eu leur mot à dire, ils en subissent aujourd'hui le poids. Alors, cette personne marche dans le monde, au milieu de la foule. Extérieurement, elle donne le change, sait ce qu'elle fait. Mais à l'intérieur, elle est complètement perdue.

Elle rencontre des gens, des hommes, des femmes. Y a des poignées de main serrées, des paumes parfois moites, mais une distance invisible reste gravée entre les êtres. On nous répète que nous sommes des animaux sociaux, pourtant, en cette année 2026, cela fait déjà bien longtemps qu'il est devenu presque impossible de nouer de véritables relations. Cet homme regarde le manège en se posant une question : par quoi ces connexions sont-elles motivées ? Quel en est l'intérêt ?

À force de voir ce que les rapports humains coûtent ou rapportent, une peur s'installe. Un besoin viscéral de sécurité. Se protéger du mal que l'autre pourrait faire, ou pire, de la déception : réaliser qu'il ne pourra jamais combler ce qu'on espérait de lui. Pour ce genre de personne, ces doutes resteront toujours une énigme sans solution.

Face à ce constat, il choisit de voyager à l'instinct, comme un fraudeur dans le métro. Incognito. Un voyageur qui avance la peur au ventre à chaque montée d'escalier, à chaque tournant, redoutant de voir une mauvaise surprise débarquer. Parce qu'au fond, il n'avait rien demandé.

Chaque matin, le réveil sonne et la même pensée s'impose : « Putain de bordel, je suis encore là. » Il faut remettre une pièce dans la machine, ajuster son masque et jouer sa partition dans la mascarade générale. Se lever pour aller à l'école, se lever pour aller travailler. Répéter mécaniquement la même routine, jour après jour.

C'est alors qu'une culpabilité dégueulasse s'installe. Il se dit qu'à la seconde même où il ouvre les yeux, il y a des gens sous les bombes, des vies fauchées, des êtres qui subissent la violence ou crèvent de faim. Lui, il a un toit, il a tout ça. Et pourtant, il se plaint. Il en vient à se demander si tout ce chemin en vaut vraiment la peine.

Pourquoi réfléchit-il ainsi ? Est-ce une culture différente ? Est-ce qu'il se croit plus intelligent qu'un autre ? Non. C'est juste qu'il est capable de porter un regard plus distant, plus reculé, sur sa propre condition et sur le monde dans lequel il évolue. Une chose est sûre : il sait qu'il n'est ni supérieur, ni inférieur. Au fond, nous sommes tous faits du même bois, nous avons tous peur.

Mais quand il se compare aux autres, l'illusion est parfaite. Eux semblent avancer sans effort ni questionnement. Alors que lui, chaque matin, se sent complètement à part. Épuisé, vidé par la simple idée de devoir continuer.`,
    media: [
      {
        id: 'm1',
        type: 'image',
        url: '/images/article-part1-illustration.svg',
        alt: 'Illustration — Solitude dans la foule, silhouette face au vide existentiel',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 'demo-2',
    title: 'L\'Éloquence des Messages Célestes',
    content: `Dans la mythologie grecque, Hermès était le messager des dieux, le guide des âmes et le gardien des voyageurs. Aujourd'hui, nous explorons comment la communication transcende les époques pour devenir un art intemporel.`,
    media: [
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        alt: 'Art abstrait céleste',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'demo-3',
    title: 'Le Voyage des Idées à l\'Ère Numérique',
    content: `Comment les concepts traversent-ils les frontières dans notre monde connecté ? Entre algorithmes et émotions brutes, le message d'aujourd'hui doit être à la fois rapide et profond.`,
    media: [
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&q=80',
        alt: 'Réseau numérique',
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'demo-4',
    title: 'Silence et Paroles — L\'Équilibre Hermétique',
    content: `Hermès nous enseigne que le silence fait autant partie du message que les mots. Dans un flux incessant d'informations, savoir quand parler et quand écouter devient une vertu rare.`,
    media: [
      {
        id: 'm4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1200&q=80',
        alt: 'Ambiance sombre et lumière',
      },
    ],
    createdAt: new Date(),
  },
];

interface StoreState {
  posts: BlogPost[];
  addPost: (payload: CreatePostPayload) => BlogPost;
}

let store: StoreState | null = null;

export function usePosts(): StoreState {
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);

  const addPost = useCallback((payload: CreatePostPayload): BlogPost => {
    const newPost: BlogPost = {
      id: `post-${++idCounter}-${Date.now()}`,
      title: payload.title,
      content: payload.content,
      media: payload.media,
      createdAt: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  return { posts, addPost };
}
