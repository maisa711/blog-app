"use client";


import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";

import PostModal from './PostModal';
import { auth } from "@utils/firebase";
import { handleSignOut } from "@utils/utilFuncs";



function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<any>(null);

  

  // profile menu items
  
  const profile = [
    // @ts-ignore
    { name: "Your Profile", href: `/profile/${session?.user?.id}`, onClick: () => { } }, 
    { name: "Sign out", href: "#", onClick: () => {handleSignOut(auth)} },
  ];

  useEffect(() => {
    const getProvidersData = async () => {
      const providersData = await getProviders();
      setProviders(providersData);
    };
    getProvidersData();
  }, [session]);

  return (
    <Disclosure as="nav" className=" bg-main-bg sticky top-0 z-10 drop-shadow-xl h-20">
      {({ open }) => (
        <>
          <div className="flex mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full items-center">
            <div className="flex h-16 items-center justify-between w-full">

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href='/'>
                  <div className="flex flex-shrink-0 items-center place-items-center">
                    {/* Logos*/}
                    <h1 className="text-main-text text-lg font-bold">Blog App</h1>
                  </div>
                </Link>

              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {/*check if user is logged in*/}
                {session?.user ? (
                  <>
                    <PostModal />
                    <Menu as="div" className="relative ml-3">
                      <div>
                        {/*profile icon*/}
                        <Menu.Button className="flex rounded-full bg-gray-800 text-main-text text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={session?.user?.image as any}
                            alt=""
                            width={30}
                            height={2}
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {profile.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={item.onClick}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>

                ) : (
                  <>
                    <Menu as="div" className="relative mr-2 sm:mr-3">
                      {providers &&
                        <Menu.Button
                        className="bg-secondary hover:bg-secondary-hover text-main-text font-bold py-2 px-3 rounded-full text-sm sm:text-base"
                        key={'credentials'}
                        onClick={() => signIn()}
                        type="button"
                      >
                        <p>Log in</p>
                      </Menu.Button>}
                      
                    </Menu>
                    <Link href="/register"
                        className="bg-secondary hover:bg-secondary-hover text-main-text font-bold py-2 px-3 rounded-full text-sm sm:text-base"
                        key={'credentials'}
                      >
                        <p>Register</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
