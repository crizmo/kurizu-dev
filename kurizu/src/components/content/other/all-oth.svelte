<script>
	import {Route} from 'tinro'; 

	import BlogsCn from '../../channels/other/blogs-cn.svelte';
	import TodoCn from '../../channels/other/todo-cn.svelte';

	import Blogs from '../other/blogs.svelte';
	import Todo from '../other/todo.svelte';
</script>

<main>
	<Route path="/blogs">
		<BlogsCn />
		<Blogs />
	</Route>

	<Route path="/to-do">
		<TodoCn />
		<Todo />
	</Route>
</main>

<style>

</style>