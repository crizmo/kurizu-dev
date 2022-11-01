<script>
  import { Route } from "tinro";

  import './style/content.css'

  import Sidebar from "./components/sidebar/sidebar.svelte";

  import AllPro from "./components/content/projects/all-pro.svelte";
  import AllOth from "./components/content/other/all-oth.svelte";
  import AllBlogs from "./components/content/other/blogs/all-blogs.svelte";

  import AllChat from "./components/content/chat/chatRoute.svelte";

  import HomeCn from "./components/channels/home/home-cn.svelte";
  import AboutCn from "./components/channels/home/about-cn.svelte";

  import Home from "./components/content/home/home.svelte";
  import About from "./components/content/home/about.svelte";
</script>

<main>
  <Sidebar />

  <!-- Home -->
  <Route path="/">
    <HomeCn />
    <Home />
  </Route>

  <Route path="/about">
    <AboutCn />
    <About />
  </Route>

  <!-- Projects -->
  <AllPro />

  <!-- Other -->
  <AllOth />

  <!-- Blogs -->
  <AllBlogs />

  <!-- Chat -->
  <AllChat />
</main>

<style>
  :root {
    background-color: #282a2e;
  }
</style>
