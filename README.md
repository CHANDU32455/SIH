# SIH

cd ../../
./env/scripts/activate
cd SIH_project\Inventory_management\SIH\inventory_management
python manage.py runserver


cd ../../
./env/scripts/activate
cd SIH_project\Inventory_management\SIH\inventory_management
cd frontend
npm start


1.    git init
2.    git remote add origin https://github.com/CHANDU32455/SIH.git
3.    git checkout -b IMR
4.    git add .   or  git add path/to/file1    or   git add path/to/folder/    
        ex: git add src/App.js      ,          git add src/components/
            git add src/App.js src/styles/ src/templates/
5.    git commit -m "initial commit"
6.    git push origin IMR

// after making initial work with branch.
git add README.md
git commit -m "Updated rough.txt with latest changes"
git push

// helps git to remember branch so that you dont have to say explicitly orgin everytime you push.
// once added "  git push  " is enough
git push --set-upstream origin IIMR  

-------------   get changes from git before pushing
 git checkout IMR                               --goes to IMR to check for changes
 git fetch origin                               --fetches changes from git
 git status                                      -- tells status
 git log HEAD..origin/IMR --oneline              -- tells you the changes taken from git
 git pull origin IMR                            -- pulls changes

----------------  update local changes 
git add filename
git commit -m "message during commit"
git push origin IMR

Username : IIMR
mail : cchantigadu75@gmail.com
Password : SIH_project_p@ssword


npm install antd