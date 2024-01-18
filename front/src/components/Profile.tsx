import { useState } from 'react'
import { Dialog, Switch } from '@headlessui/react'



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Profile() {
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
    <div>
        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">Tom Cook</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Update
            </button>
            </dd>
        </div>
        <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">tom.cook@example.com</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Update
            </button>
            </dd>
        </div>
        <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Title</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">Human Resources Manager</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Update
            </button>
            </dd>
        </div>
        </dl>
    </div>

    <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Bank accounts</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">Connect bank accounts to your account.</p>

        <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">TD Canada Trust</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Update
            </button>
        </li>
        <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">Royal Bank of Canada</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Update
            </button>
        </li>
        </ul>

        <div className="flex border-t border-gray-100 pt-6">
        <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            <span aria-hidden="true">+</span> Add another bank
        </button>
        </div>
    </div>

    <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Integrations</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">Connect applications to your account.</p>

        <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">QuickBooks</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Update
            </button>
        </li>
        </ul>

        <div className="flex border-t border-gray-100 pt-6">
        <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            <span aria-hidden="true">+</span> Add another application
        </button>
        </div>
    </div>

    <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Language and dates</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
        Choose what language and date format to use throughout your account.
        </p>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">English</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Update
            </button>
            </dd>
        </div>
        <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">DD-MM-YYYY</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Update
            </button>
            </dd>
        </div>
        <Switch.Group as="div" className="flex pt-6">
            <Switch.Label as="dt" className="flex-none pr-6 font-medium text-gray-900 sm:w-64" passive>
            Automatic timezone
            </Switch.Label>
            <dd className="flex flex-auto items-center justify-end">
            <Switch
                checked={automaticTimezoneEnabled}
                onChange={setAutomaticTimezoneEnabled}
                className={classNames(
                automaticTimezoneEnabled ? 'bg-indigo-600' : 'bg-gray-200',
                'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
            >
                <span
                aria-hidden="true"
                className={classNames(
                    automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                    'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                )}
                />
            </Switch>
            </dd>
        </Switch.Group>
        </dl>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-white">Change password</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Update your password associated with your account.
                  </p>
                </div>

        <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-white">
                        Current password
                      </label>
                      <div className="mt-2">
                        <input
                          id="current-password"
                          name="current_password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>


                    <div className="col-span-full">
                      <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-white">
                        New password
                      </label>
                      <div className="mt-2">
                        <input
                          id="new-password"
                          name="new_password"
                          type="password"
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white">
                        Confirm password
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm_password"
                          type="password"
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
                </div>
    </div>
    </div>
  )
}
