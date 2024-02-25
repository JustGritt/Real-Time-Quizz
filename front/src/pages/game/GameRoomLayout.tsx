import { Fragment, useContext } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { List, X } from '@phosphor-icons/react';
import type { UserData } from '../../contexts/socketContext';
import { UserContext } from '../../contexts/userContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Game from '../../components/Game';

console.log(Game);

const navigation = [
  { name: 'Room', href: `/game/4F989A12/play`, current: true },
  { name: 'Quiz', href: '/dashboard/quiz', current: false },
];

const userNavigation = [{ name: 'Your Profile', href: '/dashboard/profile' }];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout() {
  const { Logout } = useContext(UserContext);
  const location = useLocation();

  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: item.href === location.pathname,
  }));

  const handleLogout = async (event: any) => {
    event.preventDefault();
    Logout();
  };

  const user: UserData = JSON.parse(localStorage.getItem('user') || '{}');
  let initalLetter = '';
  if (user.id) {
    initalLetter = ((user.display_name.charAt(0).toUpperCase() as string) +
      user.display_name.charAt(1).toUpperCase()) as string;
  }

  const lastSegment = location.pathname.split('/').pop();
  const capitalizedLastSegment = lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : '';

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link to="/dashboard">
                        <span className="sr-only">Workflow</span>
                        <picture className="h-8 w-auto sm:h-10">
                          <img
                            className="block h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                            srcSet="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg, https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg 1x, https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg 2x"
                          />
                        </picture>
                      </Link>
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {updatedNavigation.map(item => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                          )}
                          aria-current={item.current ? 'location' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                            <span className="text-xs font-medium leading-none text-gray">
                              {initalLetter}
                            </span>
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map(item => (
                            <Menu.Item key={item.name}>
                              {() => (
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    location.pathname === item.href
                                      ? 'bg-gray-100'
                                      : '',
                                    'block px-4 py-2 text-sm text-gray-700',
                                  )}
                                  aria-current={
                                    location.pathname === item.href
                                      ? 'page'
                                      : undefined
                                  }
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700"
                            onClick={handleLogout}
                          >
                            Logout
                          </a>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <X className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <List className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map(item => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <span className="text-xs font-medium leading-none text-gray">
                          {initalLetter}
                        </span>
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.display_name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map(item => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className={classNames(
                          'block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800',
                          {
                            'bg-gray-100 text-gray-800':
                              location.pathname === item.href,
                          },
                        )}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {capitalizedLastSegment}
              </h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
