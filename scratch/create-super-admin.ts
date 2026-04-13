import { auth } from "../src/lib/auth";
import prisma from "../src/lib/db";

async function main() {
  const email = "abhishekverma9920@gmail.com";
  const password = "otogent_abhi_raunak@otogent.com";

  console.log(`Creating super admin: ${email}`);

  try {
    // We use the admin API to create the user to ensure hashing is correct
    const _user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Abhishek Verma",
        callbackURL: "/",
      },
    });

    console.log("User created successfully via Better Auth API.");
  } catch (error) {
    if (String(error).includes("User already exists")) {
      console.log("User already exists, proceeding to promotion.");
    } else {
      console.error("Error creating user:", error);
    }
  }

  // Promote to SUPER_ADMIN
  await prisma.user.update({
    where: { email },
    data: {
      role: "SUPER_ADMIN",
      onboardingCompleted: true,
    },
  });

  console.log("User promoted to SUPER_ADMIN.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
