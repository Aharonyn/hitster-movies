import { Movie } from "./types"

export const baseDeck: Movie[] = [
  // Original 8
  { id: "matrix_1999", title: "The Matrix", year: 1999, youtubeId: "vKQi3bBA1y8", franchise: "Matrix", confusionGroup: "matrix" },
  { id: "inception_2010", title: "Inception", year: 2010, youtubeId: "YoHD9XEInc0" },
  { id: "topgun_1986", title: "Top Gun", year: 1986, youtubeId: "qAfbp3YX9F0", franchise: "Top Gun", confusionGroup: "topgun" },
  { id: "topgun_maverick_2022", title: "Top Gun: Maverick", year: 2022, youtubeId: "giXco2jaZ_4", franchise: "Top Gun", confusionGroup: "topgun" },
  { id: "lionking_1994", title: "The Lion King", year: 1994, youtubeId: "4sj1MT05lAA" },
  { id: "darkknight_2008", title: "The Dark Knight", year: 2008, youtubeId: "EXeTwQWrcwY", franchise: "Dark Knight", confusionGroup: "batman_nolan" },
  { id: "avatar_2009", title: "Avatar", year: 2009, youtubeId: "5PSNL1qE6VY", franchise: "Avatar", confusionGroup: "avatar" },
  { id: "madmax_2015", title: "Mad Max: Fury Road", year: 2015, youtubeId: "hEJnMQG9ev8" },

  // Star Wars Saga (confusion group)
  { id: "starwars_1977", title: "Star Wars", year: 1977, youtubeId: "vZ734NWnAHA", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "empire_1980", title: "The Empire Strikes Back", year: 1980, youtubeId: "JNwNXF9Y6kA", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "jedi_1983", title: "Return of the Jedi", year: 1983, youtubeId: "7L8p7_SLzvU", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "phantom_1999", title: "The Phantom Menace", year: 1999, youtubeId: "bD7bpG-zDJQ", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "clones_2002", title: "Attack of the Clones", year: 2002, youtubeId: "gYbW1F_c9eM", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "sith_2005", title: "Revenge of the Sith", year: 2005, youtubeId: "5UnjrG_N8hU", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "awakens_2015", title: "The Force Awakens", year: 2015, youtubeId: "sGbxmsDFVnE", franchise: "Star Wars", confusionGroup: "starwars" },
  { id: "rogue_2016", title: "Rogue One", year: 2016, youtubeId: "frdj1zb9sMY", franchise: "Star Wars", confusionGroup: "starwars" },

  // Marvel MCU (confusion group)
  { id: "ironman_2008", title: "Iron Man", year: 2008, youtubeId: "8ugaeA-nMTc", franchise: "MCU", confusionGroup: "mcu" },
  { id: "avengers_2012", title: "The Avengers", year: 2012, youtubeId: "eOrNdBpGMv8", franchise: "MCU", confusionGroup: "mcu" },
  { id: "winter_2014", title: "Captain America: Winter Soldier", year: 2014, youtubeId: "7SlILk2WMTI", franchise: "MCU", confusionGroup: "mcu" },
  { id: "ultron_2015", title: "Avengers: Age of Ultron", year: 2015, youtubeId: "tmeOjFno6Do", franchise: "MCU", confusionGroup: "mcu" },
  { id: "civil_2016", title: "Captain America: Civil War", year: 2016, youtubeId: "dKrVegVI0Us", franchise: "MCU", confusionGroup: "mcu" },
  { id: "infinity_2018", title: "Avengers: Infinity War", year: 2018, youtubeId: "6ZfuNTqbHE8", franchise: "MCU", confusionGroup: "mcu" },
  { id: "endgame_2019", title: "Avengers: Endgame", year: 2019, youtubeId: "TcMBFSGVi1c", franchise: "MCU", confusionGroup: "mcu" },
  { id: "spiderman_2021", title: "Spider-Man: No Way Home", year: 2021, youtubeId: "JfVOs4VSpmA", franchise: "MCU", confusionGroup: "mcu" },

  // Lord of the Rings / Hobbit (confusion group)
  { id: "fellowship_2001", title: "The Fellowship of the Ring", year: 2001, youtubeId: "V75dMMIW2B4", franchise: "LOTR", confusionGroup: "middleearth" },
  { id: "twotowers_2002", title: "The Two Towers", year: 2002, youtubeId: "LbfMDwc4azU", franchise: "LOTR", confusionGroup: "middleearth" },
  { id: "returnking_2003", title: "The Return of the King", year: 2003, youtubeId: "r7EHjXUkkmI", franchise: "LOTR", confusionGroup: "middleearth" },
  { id: "hobbit_2012", title: "The Hobbit: An Unexpected Journey", year: 2012, youtubeId: "SDnYMbYB-nU", franchise: "Hobbit", confusionGroup: "middleearth" },
  { id: "hobbit2_2013", title: "The Hobbit: The Desolation of Smaug", year: 2013, youtubeId: "fnaojlfdUbs", franchise: "Hobbit", confusionGroup: "middleearth" },
  { id: "hobbit3_2014", title: "The Hobbit: The Battle of Five Armies", year: 2014, youtubeId: "iVAgTiBrrDA", franchise: "Hobbit", confusionGroup: "middleearth" },

  // Harry Potter (confusion group)
  { id: "potter1_2001", title: "Harry Potter and the Sorcerer's Stone", year: 2001, youtubeId: "VyHV0BRtdxo", franchise: "Harry Potter", confusionGroup: "potter" },
  { id: "potter2_2002", title: "Harry Potter and the Chamber of Secrets", year: 2002, youtubeId: "1bq0qff4iF8", franchise: "Harry Potter", confusionGroup: "potter" },
  { id: "potter3_2004", title: "Harry Potter and the Prisoner of Azkaban", year: 2004, youtubeId: "lAxgztbYDbs", franchise: "Harry Potter", confusionGroup: "potter" },
  { id: "potter5_2007", title: "Harry Potter and the Order of the Phoenix", year: 2007, youtubeId: "y6ZW7KXaXYk", franchise: "Harry Potter", confusionGroup: "potter" },
  { id: "potter7b_2011", title: "Harry Potter and the Deathly Hallows Part 2", year: 2011, youtubeId: "5NYt1qirBWg", franchise: "Harry Potter", confusionGroup: "potter" },

  // Fast & Furious (confusion group)
  { id: "fast1_2001", title: "The Fast and the Furious", year: 2001, youtubeId: "2TAOizOnN1Y", franchise: "Fast", confusionGroup: "fastandfurious" },
  { id: "fast5_2011", title: "Fast Five", year: 2011, youtubeId: "mRDgUEPEkt0", franchise: "Fast", confusionGroup: "fastandfurious" },
  { id: "fast7_2015", title: "Furious 7", year: 2015, youtubeId: "Skpu5HaVkOc", franchise: "Fast", confusionGroup: "fastandfurious" },
  { id: "fast9_2021", title: "F9: The Fast Saga", year: 2021, youtubeId: "aSiDu3Ywi8E", franchise: "Fast", confusionGroup: "fastandfurious" },

  // Jurassic Park/World (confusion group)
  { id: "jurassic_1993", title: "Jurassic Park", year: 1993, youtubeId: "lc0UehYemQA", franchise: "Jurassic", confusionGroup: "jurassic" },
  { id: "lost_1997", title: "The Lost World: Jurassic Park", year: 1997, youtubeId: "DXL3Pi6KPVs", franchise: "Jurassic", confusionGroup: "jurassic" },
  { id: "jurassicworld_2015", title: "Jurassic World", year: 2015, youtubeId: "RFinNxS5KN4", franchise: "Jurassic", confusionGroup: "jurassic" },
  { id: "fallen_2018", title: "Jurassic World: Fallen Kingdom", year: 2018, youtubeId: "vn9mMeWcgoM", franchise: "Jurassic", confusionGroup: "jurassic" },

  // Mission Impossible (confusion group)
  { id: "mi1_1996", title: "Mission: Impossible", year: 1996, youtubeId: "m0r95TT1QfQ", franchise: "Mission Impossible", confusionGroup: "missionimpossible" },
  { id: "mi3_2006", title: "Mission: Impossible III", year: 2006, youtubeId: "s62pPbV-PYs", franchise: "Mission Impossible", confusionGroup: "missionimpossible" },
  { id: "mi4_2011", title: "Mission: Impossible - Ghost Protocol", year: 2011, youtubeId: "EDGYVFZboNo", franchise: "Mission Impossible", confusionGroup: "missionimpossible" },
  { id: "mi6_2018", title: "Mission: Impossible - Fallout", year: 2018, youtubeId: "wb49-oV0F78", franchise: "Mission Impossible", confusionGroup: "missionimpossible" },

  // Back to the Future (confusion group)
  { id: "bttf1_1985", title: "Back to the Future", year: 1985, youtubeId: "qvsgGtivCgs", franchise: "Back to the Future", confusionGroup: "bttf" },
  { id: "bttf2_1989", title: "Back to the Future Part II", year: 1989, youtubeId: "MdENmefJRpw", franchise: "Back to the Future", confusionGroup: "bttf" },
  { id: "bttf3_1990", title: "Back to the Future Part III", year: 1990, youtubeId: "YTjU5nHCU3c", franchise: "Back to the Future", confusionGroup: "bttf" },

  // Indiana Jones (confusion group)
  { id: "raiders_1981", title: "Raiders of the Lost Ark", year: 1981, youtubeId: "XkkzKHCx154", franchise: "Indiana Jones", confusionGroup: "indy" },
  { id: "temple_1984", title: "Indiana Jones and the Temple of Doom", year: 1984, youtubeId: "0h-T0aT71VY", franchise: "Indiana Jones", confusionGroup: "indy" },
  { id: "crusade_1989", title: "Indiana Jones and the Last Crusade", year: 1989, youtubeId: "iN6OhRdWZW4", franchise: "Indiana Jones", confusionGroup: "indy" },
  { id: "crystal_2008", title: "Indiana Jones and the Kingdom of the Crystal Skull", year: 2008, youtubeId: "gvxNaSIB_WI", franchise: "Indiana Jones", confusionGroup: "indy" },

  // Rocky/Creed (confusion group)
  { id: "rocky_1976", title: "Rocky", year: 1976, youtubeId: "3VUblDmGRPs", franchise: "Rocky", confusionGroup: "rocky" },
  { id: "rocky4_1985", title: "Rocky IV", year: 1985, youtubeId: "1SUzcDUERLo", franchise: "Rocky", confusionGroup: "rocky" },
  { id: "creed_2015", title: "Creed", year: 2015, youtubeId: "Uv554B7YHk4", franchise: "Creed", confusionGroup: "rocky" },
  { id: "creed2_2018", title: "Creed II", year: 2018, youtubeId: "u9Vq9N9L2Tw", franchise: "Creed", confusionGroup: "rocky" },

  // Terminator (confusion group)
  { id: "terminator_1984", title: "The Terminator", year: 1984, youtubeId: "k64P4l2Wmeg", franchise: "Terminator", confusionGroup: "terminator" },
  { id: "t2_1991", title: "Terminator 2: Judgment Day", year: 1991, youtubeId: "CRRlbK5w8AE", franchise: "Terminator", confusionGroup: "terminator" },
  { id: "genisys_2015", title: "Terminator Genisys", year: 2015, youtubeId: "jNU_jrPxs-0", franchise: "Terminator", confusionGroup: "terminator" },

  // Alien (confusion group)
  { id: "alien_1979", title: "Alien", year: 1979, youtubeId: "LjLamj-b0I8", franchise: "Alien", confusionGroup: "alien" },
  { id: "aliens_1986", title: "Aliens", year: 1986, youtubeId: "oSeQQlaCZgU", franchise: "Alien", confusionGroup: "alien" },
  { id: "prometheus_2012", title: "Prometheus", year: 2012, youtubeId: "N0WUpsErUBA", franchise: "Alien", confusionGroup: "alien" },

  // Die Hard (confusion group)
  { id: "diehard_1988", title: "Die Hard", year: 1988, youtubeId: "2TQ-pOvI6Xo", franchise: "Die Hard", confusionGroup: "diehard" },
  { id: "diehard2_1990", title: "Die Hard 2", year: 1990, youtubeId: "JcbSzGLHQEQ", franchise: "Die Hard", confusionGroup: "diehard" },
  { id: "diehard3_1995", title: "Die Hard with a Vengeance", year: 1995, youtubeId: "8YS9U44ij-k", franchise: "Die Hard", confusionGroup: "diehard" },

  // Batman (confusion group)
  { id: "batman_1989", title: "Batman", year: 1989, youtubeId: "dgC9Q0uhX70", franchise: "Batman", confusionGroup: "batman_burton" },
  { id: "batmanreturns_1992", title: "Batman Returns", year: 1992, youtubeId: "AfbFPo3Z9Mk", franchise: "Batman", confusionGroup: "batman_burton" },
  { id: "batmanbegins_2005", title: "Batman Begins", year: 2005, youtubeId: "neY2xVmOfUM", franchise: "Batman", confusionGroup: "batman_nolan" },
  { id: "rises_2012", title: "The Dark Knight Rises", year: 2012, youtubeId: "g8evyE9TuYk", franchise: "Batman", confusionGroup: "batman_nolan" },

  // Matrix sequels
  { id: "reloaded_2003", title: "The Matrix Reloaded", year: 2003, youtubeId: "kYzz0FSgpSU", franchise: "Matrix", confusionGroup: "matrix" },
  { id: "resurrections_2021", title: "The Matrix Resurrections", year: 2021, youtubeId: "9ix7TUGVYIo", franchise: "Matrix", confusionGroup: "matrix" },

  // Avatar sequel
  { id: "avatar2_2022", title: "Avatar: The Way of Water", year: 2022, youtubeId: "d9MyW72ELq0", franchise: "Avatar", confusionGroup: "avatar" },

  // Standalone classics (no confusion groups)
  { id: "titanic_1997", title: "Titanic", year: 1997, youtubeId: "2e-eXJ6HgkQ" },
  { id: "forrest_1994", title: "Forrest Gump", year: 1994, youtubeId: "bLvqoHBptjg" },
  { id: "pulp_1994", title: "Pulp Fiction", year: 1994, youtubeId: "s7EdQ4FqbhY" },
  { id: "shawshank_1994", title: "The Shawshank Redemption", year: 1994, youtubeId: "6hB3S9bIaco" },
  { id: "gladiator_2000", title: "Gladiator", year: 2000, youtubeId: "owK1qxDselE" },
  { id: "fight_1999", title: "Fight Club", year: 1999, youtubeId: "SUXWAEX2jlg" },
  { id: "sixth_1999", title: "The Sixth Sense", year: 1999, youtubeId: "VG9AGf66tXM" },
  { id: "saving_1998", title: "Saving Private Ryan", year: 1998, youtubeId: "zwhP5b4tD6g" },
  { id: "goodfellas_1990", title: "Goodfellas", year: 1990, youtubeId: "qo5jJpHtI1Y" },
  { id: "silence_1991", title: "The Silence of the Lambs", year: 1991, youtubeId: "W6Mm8Sbe__o" },
  { id: "schindler_1993", title: "Schindler's List", year: 1993, youtubeId: "gG22XNhtnoY" },
  { id: "departed_2006", title: "The Departed", year: 2006, youtubeId: "SGWvwjZ0eDc" },
  { id: "prestige_2006", title: "The Prestige", year: 2006, youtubeId: "o4gHCmTQDVI" },
  { id: "interstellar_2014", title: "Interstellar", year: 2014, youtubeId: "zSWdZVtXT7E" },
  { id: "social_2010", title: "The Social Network", year: 2010, youtubeId: "lB95KLmpLR4" },
  { id: "whiplash_2014", title: "Whiplash", year: 2014, youtubeId: "7d_jQycdQGo" },
  { id: "lalaland_2016", title: "La La Land", year: 2016, youtubeId: "0pdqf4P9MB8" },
  { id: "parasite_2019", title: "Parasite", year: 2019, youtubeId: "5xH0HfJHsaY" },
  { id: "dunkirk_2017", title: "Dunkirk", year: 2017, youtubeId: "F-eMt3SrfFU" },
  { id: "joker_2019", title: "Joker", year: 2019, youtubeId: "zAGVQLHvwOY" },
  { id: "1917_2019", title: "1917", year: 2019, youtubeId: "YqNYrYUiMfg" },
  { id: "knives_2019", title: "Knives Out", year: 2019, youtubeId: "qGqiHJTsRkQ" },
  { id: "arrival_2016", title: "Arrival", year: 2016, youtubeId: "tFMo3UJ4B4g" },
  { id: "blade_2017", title: "Blade Runner 2049", year: 2017, youtubeId: "gCcx85zbxz4" },
  { id: "gone_2014", title: "Gone Girl", year: 2014, youtubeId: "2-_-1nJf8Vg" },
  { id: "wolf_2013", title: "The Wolf of Wall Street", year: 2013, youtubeId: "iszwuX1AK6A" },
  { id: "django_2012", title: "Django Unchained", year: 2012, youtubeId: "_lVi0J-1fQ4" },
  { id: "gran_2017", title: "The Greatest Showman", year: 2017, youtubeId: "AXCTMGYUg9A" },
  { id: "baby_2017", title: "Baby Driver", year: 2017, youtubeId: "z2z857RSfhk" },
  { id: "margin_2011", title: "Margin Call", year: 2011, youtubeId: "IjZ-ke1kJrA" },
  { id: "spotlight_2015", title: "Spotlight", year: 2015, youtubeId: "Zg5zSP3kgo0" },
  { id: "ex_2014", title: "Ex Machina", year: 2014, youtubeId: "XYGzRB4Pnq8" },
  { id: "dune_2021", title: "Dune", year: 2021, youtubeId: "8g18jFHCLXk" },
  { id: "tenet_2020", title: "Tenet", year: 2020, youtubeId: "LdOM0x0XDMo" },
  { id: "once_2019", title: "Once Upon a Time in Hollywood", year: 2019, youtubeId: "ELeMaP8EPAA" },
  { id: "jojo_2019", title: "Jojo Rabbit", year: 2019, youtubeId: "tL4McUzXfFI" },
  { id: "ford_2019", title: "Ford v Ferrari", year: 2019, youtubeId: "zyYgDtY2AMY" },
]

