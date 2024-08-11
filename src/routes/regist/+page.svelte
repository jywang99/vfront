<script>
    import { axio } from "$lib/api";

  /**
   * @param {SubmitEvent} event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (form == null || !(form instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(form);

    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('nickname');

    axio.post('/regist', { email, password, name }).then((res) => {
      if (alert('Sign up success') == undefined) {
        window.location.href = '/login';
      }
    }).catch((err) => {
      alert('Sign up failed!');
      console.error(err);
    });
  }
</script>

<h1>Sign up</h1>
<form on:submit={handleSubmit}>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <br />

  <label for="nickname">Nickname</label>
  <input type="text" id="nickname" name="nickname" required />
  <br />

  <label for="password">Password</label>
  <input type="password" id="password" name="password" required />
  <br />

  <label for="confirmPassword">Confirm Password</label>
  <input type="password" id="confirmPassword" name="confirmPassword" required />
  <br />

  <button type="submit">Sign up</button>
  <a href="/login">Login</a>
</form>

