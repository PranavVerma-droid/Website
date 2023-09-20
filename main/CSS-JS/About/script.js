const firebaseConfig = {
    apiKey: "AIzaSyCA_BPpKq3IhLupHnGYbbwq0U1mLdMbJXY",
    authDomain: "contactusform-f0ec2.firebaseapp.com",
    databaseURL: "https://contactusform-f0ec2-default-rtdb.firebaseio.com",
    projectId: "contactusform-f0ec2",
    storageBucket: "contactusform-f0ec2.appspot.com",
    messagingSenderId: "641931730164",
    appId: "1:641931730164:web:0812ee1bf4659f8381d2a1",
    measurementId: "G-1RVB7HZQWB"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.firestore();
  const realdb = firebase.database();
  
      const app = Vue.createApp({
        data() {
          return {
            user: null,
            email: "",
            password: "",
            projectName: "",
            projectDescription: "",
            projectImg: "",
            projects: [],
            skillzName: "",
            skillzClass: "",
            skillz: [],
            showDropdown: false,
            menuOpen: false,
            isMobile: false
          };
        },
        mounted() {
          this.loadProjects();
          this.loadSkillz();
          this.loadAboutMe();
          firebase.auth().onAuthStateChanged(user => {
            this.user = user;
          });
          this.updateScreenSize();
          window.addEventListener('resize', this.updateScreenSize);
        },
        beforeUnmount() {
          window.removeEventListener('resize', this.updateScreenSize);
        },
        methods: {
          toggleDropdown() {
            this.showDropdown = !this.showDropdown;
          },
          submitProject() {
  
  db.collection("about").add({
    projectName: this.projectName,
    projectDescription: this.projectDescription,
    projectImg: this.projectImg,
    author: this.user ? this.user.email : "Anonymous",
    publication_date: new Date().toISOString(),
  })
  .then(() => {
    this.projectName = "";
    this.projectDescription = "";
    this.projectImg = "";
    alert("Project submitted successfully!");
  })
  .catch(error => {
    console.error(error);
    alert("Project to submit blog.");
  });
  
  },
          loadProjects() {
            db.collection("about").get()
              .then(querySnapshot => {
                const projects = [];
                querySnapshot.forEach(doc => {
                  const project = doc.data();
                  project.id = doc.id;
                  projects.push(project);
                });
                this.projects = projects;
              })
              .catch(error => {
                console.error(error);
                alert("Failed to load projects.");
              });         
            },
  
              loadSkillz() {
                      db.collection("skillz").get()
                        .then(querySnapshot => {
                          const skillz = [];
                          querySnapshot.forEach(doc => {
                            const skill = doc.data();
                            skill.id = doc.id;
                            skillz.push(skill);
                          });
                          this.skillz = skillz;
                        })
                        .catch(error => {
                          console.error(error);
                          alert("Failed to load skills.");
                        });         
              },
          updateScreenSize() {
            // Get the current window width
            const windowWidth = window.innerWidth;
            // Update the 'screenSize' data property based on the window width
            if (windowWidth <= 800) {
              this.isMobile = true;
            } else {
              this.isMobile = false;
            }
          },
          closeDropdown() {
            this.showDropdown = false;
          },
          
          login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
              .then(userCredential => {
                this.user = userCredential.user;
                this.email = "";
                this.password = "";
              })
              .catch(error => {
                console.error(error);
                alert("Login failed. Please check your credentials.");
              });
          },
          signOut() {
            firebase.auth().signOut()
              .then(() => {
                this.user = null;
              })
              .catch(error => {
                console.error(error);
                alert("Sign out failed.");
              });
          },
          toggleMenu() {
            this.menuOpen = !this.menuOpen;
          }
        },
        computed: {
    signInText() {
      if (this.user) {
        if (window.innerWidth <= 800) {
          return 'Account';
        } else {
          return this.user.email;
        }
      } else {
        return 'Sign In';
      }
    },
    loadAboutMe() {
        const aboutMeRef = realdb.ref('info/about-me');
    
        aboutMeRef.on('value', (snapshot) => {
            const aboutMeText = snapshot.val();
            const aboutMePlaceholder = document.getElementById('about-me-placeholder');
    
            if (aboutMeText) {
                aboutMePlaceholder.textContent = aboutMeText;
            } else {
                aboutMePlaceholder.textContent = 'No about me information available.';
            }
        });
    }
  }
      });
  
      app.mount('#app');