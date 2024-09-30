# SIH

cd ../../
./env/scripts/activate
cd SIH\Inventory_management\inventory_management
python manage.py runserver


cd ../../
./env/scripts/activate
cd SIH\Inventory_management\inventory_management
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
git add .
git commit -m "navbar styled"
git push origin IMR

Username : IIMR
mail : cchantigadu75@gmail.com
Password : SIH_project_p@ssword



DGP – Director General of Police               ---  nanda
ADGP – Additional Director General of Police    --- manasa
IGP – Inspector General of Police             --- Charanya
DIG – Deputy Inspector General of Police      --- Ashish
SP – Superintendent of Police        --- sowmya
ASP  – Sub-Inspector of Police         --- Ashok


project setup backend                                   -- completed
project setup frontend                                  -- completed
integrate backend and frontend                          -- completed
trail an api point in database                          -- completed
implement login and signup functionalities              -- incomplete(in page moment restriction)
ui to easily create new stations                        -- going(css balance)
station table to handle stations                        -- created(possible future updates)
Assests table to handle assests details                 -- working        
enter data related to each station                      -- working
dynamically load them on to frontend in dashboard  
make routes protected
Tight authentication by role based access


Track assests and update assests accross different locations.(assest details- location, status, lastused etc)
automated tracking using barcodes or RFID.    - scan code and know all its details(where, expiry,
    status(working or failure), recent failure and reason etc)

inventory audits by station master to know accuracy and up to date..?     --accurate inventory records
check hardware for acquisitions, disposals or relocations.    --timely updates

dynamic allocation of resources based on usage and needs.
check under utilised hardware and optimize deployment -- utilisation monitoring

maintainance period for each typr of assests individually,...        --scheduled maintainance
    alert timely upgrades   -- reduces failures of hardware    --maintainance
track lifetime of assests and alert station master for timely replace,ments.   --Life_cycle_management

compilance tracking features to meet regulatory and policy requirements.    --compilance
security protocols for tracking and managing assests.                       -- security measures

use inventory data to perform cost analysis and identify chances for cost savings through efficient management and procurements --cost management
inform budgeting and financial planning --ensures adequate funding for future hardware assests


29/9/24   -- plan to load assests in station dynamically on dashboard

we have stations -- PK is StationID
we have assests  -- PK is RFID or  Barcode
in stations table at assests attribute we have multiple values. each value is an assest_id and of assest_type.
we load stations dynamicallyon dashboard. On clicking each station we can have access to its resources based on assest type. On hover each assest shows its count. on clicking each assest it shows its all details from assest table..  you can move each assest also based on your permissions to differnt locations and also being a station master you can request for assests.

movement of assests.
station masters can request assests for their stations on need and they can be allocated by admin,some professionals with high ranks.for every assests there is a move button and can be moved by station master. 
there is a requests page where every station can see assests requested from another stations and can provide assests if they think its ok.