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

const app = Vue.createApp({
data() {
return {
user: null,
email: "",
password: "",
title: "",
content: "",
blogs: [],
blogIdToEdit: null,
categories: [],
selectedCategory: null, 
showDropdown: false,
menuOpen: false,
isMobile: false
};
},
mounted() {
firebase.auth().onAuthStateChanged(user => {
this.user = user;
this.fetchBlogs();
this.updateScreenSize();
window.addEventListener('resize', this.updateScreenSize);
});
},
beforeUnmount() {
  window.removeEventListener('resize', this.updateScreenSize);
},
methods: {
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  },
  closeDropdown() {
    this.showDropdown = false;
  },
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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
login() {
firebase.auth().signInWithEmailAndPassword(this.email, this.password)
  .then(userCredential => {
    this.user = userCredential.user;
    this.email = "";
    this.password = "";
    this.fetchBlogs();
  })
  .catch(error => {
    console.error(error);
    alert("Login failed. Please check your credentials.");
  });
},
filterBlogs(category) {
  if (category) {
    this.blogs = this.allBlogs.filter(blog => blog.category === category);
  } else {
    this.blogs = this.allBlogs;
  }

  this.selectedCategory = category; 
},
submitBlog() {
if (this.blogIdToEdit) {
  // Edit existing blog
  db.collection("posts").doc(this.blogIdToEdit).update({
    title: this.title,
    content: this.content,
    category: this.selectedCategory // Add the selected category to the blog
  })
  .then(() => {
    this.title = "";
    this.content = "";
    this.blogIdToEdit = null;
    this.fetchBlogs();
    alert("Blog updated successfully!");
  })
  .catch(error => {
    console.error(error);
    alert("Failed to update blog.");
  });
} else {
  // Create new blog
  db.collection("posts").add({
    title: this.title,
    content: this.content,
    author: this.user ? this.user.email : "Anonymous",
    publication_date: new Date().toISOString(),
    category: this.selectedCategory // Add the selected category to the blog
  })
  .then(() => {
    this.title = "";
    this.content = "";
    this.selectedCategory = null; // Clear selected category
    this.fetchBlogs();
    alert("Blog submitted successfully!");
  })
  .catch(error => {
    console.error(error);
    alert("Failed to submit blog.");
  });
}
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
async fetchBlogs() {
try {
  let query = db.collection("posts").orderBy("publication_date", "desc");
  if (this.selectedCategory) {
    query = query.where("category", "==", this.selectedCategory);
  }
  const querySnapshot = await query.get();
  this.blogs = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
} catch (error) {
  console.error(error);
  alert("Failed to fetch blogs.");
}
},
formatDate(dateString) {
const date = new Date(dateString);
return date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});
},
editBlog(blog) {
// Set the title, content, and selected category to the current blog's values for editing
this.title = blog.title;
this.content = blog.content;
this.selectedCategory = blog.category;
// Save the blog ID to know which blog is being edited
this.blogIdToEdit = blog.id;
},
deleteBlog(blogId) {
const confirmation = confirm("Are you sure you want to delete this blog?");
if (confirmation) {
  db.collection("posts")
    .doc(blogId)
    .delete()
    .then(() => {
      this.fetchBlogs();
      alert("Blog deleted successfully!");
    })
    .catch(error => {
      console.error(error);
      alert("Failed to delete blog.");
    });
}
},
fetchCategories() {
db.collection("categories").get()
  .then(querySnapshot => {
    this.categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
  })
  .catch(error => {
    console.error(error);
    alert("Failed to fetch categories.");
  });
},
selectCategory(categoryId) {
this.selectedCategory = categoryId;
this.fetchBlogs();
},
clearCategorySelection() {
this.selectedCategory = null;
this.fetchBlogs();
}
},
computed: {
selectedCategoryName() {
if (!this.selectedCategory) return "All";
const selectedCategory = this.categories.find(category => category.id === this.selectedCategory);
return selectedCategory ? selectedCategory.name : "All";

},
signInText() {
  return this.user ? this.user.email : 'Sign In';
}
}
});

app.mount('#app');