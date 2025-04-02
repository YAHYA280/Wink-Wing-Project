"use client";
// next
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// react tabs
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// types
import { Radius } from "@/types/types";

// react map gl
const Map = dynamic(() => import("react-map-gl"), { ssr: false });
import "mapbox-gl/dist/mapbox-gl.css";

// context
import { useUserPreferences } from "@/context/userPreferencesContext";

// utils
import { getListingsCount } from "@/utils/listings";

// components
import CityDropdown from "./CityDropdown";
import NeighbourhoodDropdown from "./NeighbourhoodDropdown";

// redux
import { useAppSelector } from "@/store/hooks/hooks";

export default function SearchMenu() {
  const {
    selectedLat,
    selectedLng,
    selectedNeighbourhood,
    viewport,
    setViewport,
    mapRef,
    selectedRadius,
    setIsRadiusActive,
    isRadiusActive,
    setSelectedRadius,
    radius,
    setSelectedRadiusValue,
    type,
    setType,
    matches,
    setMatches,
    setRadius,
    setMaxTravelTime,
    setTransportType,
  } = useUserPreferences();

  const { token } = useAppSelector((state) => state.auth);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const maxTravelTimeOptions = [
    {
      id: 1,
      label: "15 minutes",
      value: 15,
    },
    {
      id: 2,
      label: "30 minutes",
      value: 30,
    },
    {
      id: 3,
      label: "45 minutes",
      value: 45,
    },
    {
      id: 4,
      label: "1 hour",
      value: 60,
    },
  ];

  const transportTypeOptions = [
    {
      id: 1,
      label: "walking",
      value: "WALKING",
    },
    {
      id: 2,
      label: "cycling",
      value: "CYCLING",
    },
    {
      id: 3,
      label: "driving",
      value: "DRIVING",
    },
    {
      id: 4,
      label: "public transport",
      value: "PUBLIC_TRANSPORT",
    },
  ];

  // Map over radius and extract only the value
  const radiusValue = radius.map((radius) => radius.value);

  // Map over selectedNeighbourhoods and extract only the id
  const neighbourhoodsID = selectedNeighbourhood.map((neighborhood) => ({
    id: neighborhood.id,
  }));

  useEffect(() => {
    const fetchListingsCount = async () => {
      const body = {
        type,
        neighbourhoods: neighbourhoodsID,
        point: [selectedLng, selectedLat] as [number, number],
        radius: 300,
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [4.98051, 52.33078],
                [4.99786, 52.31398],
                [5.01613, 52.32451],
                [5.02154, 52.30246],
                [5.00789, 52.30152],
                [4.99748, 52.28912],
                [4.98351, 52.29037],
                [4.95524, 52.27831],
                [4.92933, 52.30853],
                [4.94049, 52.32568],
                [4.94766, 52.32814],
                [4.95268, 52.32264],
                [4.98051, 52.33078],
              ],
            ],
            [
              [
                [4.98675, 52.36511],
                [4.99078, 52.36377],
                [4.98044, 52.35856],
                [4.97451, 52.36158],
                [4.98675, 52.36511],
              ],
            ],
            [
              [
                [5.01415, 52.37169],
                [5.01251, 52.37244],
                [5.01314, 52.37307],
                [5.01456, 52.37296],
                [5.01415, 52.37169],
              ],
            ],
            [
              [
                [5.02152, 52.38412],
                [5.01838, 52.38039],
                [5.0143, 52.37417],
                [5.01834, 52.38345],
                [5.0237, 52.38685],
                [5.02152, 52.38412],
              ],
            ],
            [
              [
                [4.76656, 52.42755],
                [4.85608, 52.41666],
                [4.86268, 52.42994],
                [4.87074, 52.43039],
                [4.93072, 52.41161],
                [4.95277, 52.42368],
                [4.98264, 52.42676],
                [5.03004, 52.41564],
                [5.06841, 52.41545],
                [5.03153, 52.40092],
                [5.02524, 52.38818],
                [5.00846, 52.38273],
                [5.01281, 52.37319],
                [4.99853, 52.37878],
                [4.98026, 52.37367],
                [4.95956, 52.38198],
                [4.98349, 52.36795],
                [5.01451, 52.36802],
                [4.95778, 52.36766],
                [4.97527, 52.35715],
                [4.99001, 52.35707],
                [4.99208, 52.36166],
                [5.00901, 52.35328],
                [5.01652, 52.35535],
                [5.01129, 52.34283],
                [4.99932, 52.34154],
                [4.96959, 52.3561],
                [4.94955, 52.33838],
                [4.91293, 52.33051],
                [4.90913, 52.31825],
                [4.85676, 52.32141],
                [4.85592, 52.33032],
                [4.81875, 52.32556],
                [4.75612, 52.35611],
                [4.75782, 52.39666],
                [4.72876, 52.40071],
                [4.73921, 52.43106],
                [4.76656, 52.42755],
              ],
            ],
          ],
        },
      };

      const count = await getListingsCount(body);
      setMatches(count);
    };

    fetchListingsCount();
  }, [
    matches,
    type,
    selectedNeighbourhood,
    selectedLat,
    selectedLng,
    radiusValue,
  ]);

  return (
    <div className="w-full md:w-[770px] h-max bg-[#F8F8F8] rounded-xl px-4 md:px-[35px] py-[30px] mb-10">
      <div className="flex flex-col gap-5">
        <h3 className="font-semibold text-lg text-[#484848]">
          Select location based on
        </h3>
        <Tabs
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <TabList className="flex flex-col sm:flex-row items-center justify-between bg-[#EFEFEF] p-2 rounded-[8px]">
            <Tab
              onClick={() => setType("NEIGHBOURHOODS")}
              selectedClassName="bg-main shadow rounded-lg text-white h-[50px]"
              className="flex items-center justify-center gap-1 cursor-pointer w-[240px] py-4 outline-none transition-all duration-100"
            >
              <span>
                <svg
                  height="13"
                  viewBox="0 0 10 13"
                  width="10"
                  fill={selectedIndex === 0 ? "#fff" : "#575757"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.37134 12.0156C0.949463 7.09375 0.340088 6.57812 0.340088 4.75C0.340088 2.26562 2.33228 0.25 4.84009 0.25C7.32446 0.25 9.34009 2.26562 9.34009 4.75C9.34009 6.57812 8.70728 7.09375 5.2854 12.0156C5.07446 12.3438 4.58228 12.3438 4.37134 12.0156ZM4.84009 6.625C5.87134 6.625 6.71509 5.80469 6.71509 4.75C6.71509 3.71875 5.87134 2.875 4.84009 2.875C3.7854 2.875 2.96509 3.71875 2.96509 4.75C2.96509 5.80469 3.7854 6.625 4.84009 6.625Z" />
                </svg>
              </span>
              Neighbourhoods
            </Tab>
            <Tab
              onClick={() => setType("RADIUS")}
              selectedClassName="bg-main shadow rounded-lg text-white h-[50px]"
              className="flex items-center justify-center gap-1 cursor-pointer w-[240px] py-4 outline-none transition-all duration-100"
            >
              <span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill={selectedIndex === 1 ? "#fff" : "#575757"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.26001 1.1875C7.26001 0.8125 7.58813 0.53125 7.9397 0.625C10.4475 1.28125 12.3225 3.55469 12.3225 6.25C12.3225 9.46094 9.72095 12.0625 6.51001 12.0625C3.29907 12.0859 0.69751 9.50781 0.69751 6.29688C0.674072 3.57812 2.52563 1.28125 5.03345 0.625C5.40845 0.53125 5.76001 0.8125 5.76001 1.1875V1.5625C5.76001 1.82031 5.57251 2.03125 5.33813 2.10156C3.51001 2.61719 2.19751 4.28125 2.19751 6.25C2.19751 8.64062 4.11938 10.5625 6.51001 10.5625C8.8772 10.5625 10.8225 8.64062 10.8225 6.25C10.8225 4.28125 9.48657 2.61719 7.65845 2.10156C7.42407 2.03125 7.26001 1.82031 7.26001 1.5625V1.1875Z" />
                </svg>
              </span>
              Radius
            </Tab>
            <Tab
              onClick={() => setType("TRAVEL_TIME")}
              selectedClassName="bg-main shadow rounded-lg text-white h-[50px]"
              className="flex items-center justify-center gap-1 cursor-pointer w-[240px] py-4 outline-none transition-all duration-100"
            >
              <span>
                <svg
                  width="10"
                  height="14"
                  viewBox="0 0 10 14"
                  fill={selectedIndex === 2 ? "#fff" : "#575757"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.71276 2.98148C3.71276 3.47644 4.114 3.87768 4.60895 3.87768C5.10391 3.87768 5.50515 3.47644 5.50515 2.98148V2.84383C5.50515 2.27285 5.96802 1.80998 6.539 1.80998H7.50451C7.88516 1.80998 8.19374 1.5014 8.19374 1.12075C8.19374 0.740098 7.88516 0.431519 7.50451 0.431519H1.7134C1.33275 0.431519 1.02417 0.740098 1.02417 1.12075C1.02417 1.5014 1.33275 1.80998 1.7134 1.80998H2.67891C3.24989 1.80998 3.71276 2.27285 3.71276 2.84383V2.98148Z"
                    fill="#757575"
                  />
                  <path
                    d="M3.71276 2.98148C3.71276 3.47644 4.114 3.87768 4.60895 3.87768C5.10391 3.87768 5.50515 3.47644 5.50515 2.98148V2.84383C5.50515 2.27285 5.96802 1.80998 6.539 1.80998H7.50451C7.88516 1.80998 8.19374 1.5014 8.19374 1.12075C8.19374 0.740098 7.88516 0.431519 7.50451 0.431519H1.7134C1.33275 0.431519 1.02417 0.740098 1.02417 1.12075C1.02417 1.5014 1.33275 1.80998 1.7134 1.80998H2.67891C3.24989 1.80998 3.71276 2.27285 3.71276 2.84383V2.98148Z"
                    stroke="none"
                  />
                  <path
                    d="M7.68168 4.73926H1.53634C1.12887 4.73926 0.738102 4.86893 0.449983 5.09974C0.161864 5.33056 0 5.64361 0 5.97003V11.5085C0 11.8349 0.161864 12.148 0.449983 12.3788C0.664791 12.5509 0.936659 12.6667 1.22996 12.7146C1.39768 12.7419 1.53634 12.877 1.53634 13.047C1.53634 13.2169 1.6741 13.3547 1.84403 13.3547H2.76498C2.93491 13.3547 3.07267 13.2169 3.07267 13.047C3.07267 12.877 3.21043 12.7393 3.38037 12.7393H5.83765C6.00759 12.7393 6.14535 12.877 6.14535 13.047C6.14535 13.2169 6.2831 13.3547 6.45304 13.3547H7.37399C7.54392 13.3547 7.68168 13.2169 7.68168 13.047C7.68168 12.877 7.82034 12.7419 7.98806 12.7146C8.28136 12.6667 8.55323 12.5509 8.76804 12.3788C9.05615 12.148 9.21802 11.8349 9.21802 11.5085V5.97003C9.21802 5.64361 9.05615 5.33056 8.76804 5.09974C8.47992 4.86893 8.08914 4.73926 7.68168 4.73926ZM7.68168 7.2008V8.04749C7.68168 8.25961 7.50972 8.43157 7.2976 8.43157C7.08547 8.43157 6.91351 8.25961 6.91351 8.04749V7.81618C6.91351 7.47632 6.638 7.2008 6.29813 7.2008H1.84403C1.67409 7.2008 1.53634 7.06304 1.53634 6.89311C1.53634 6.72317 1.6741 6.58541 1.84403 6.58541H7.0663C7.40616 6.58541 7.68168 6.86093 7.68168 7.2008Z"
                    fill="none"
                  />
                  <path
                    d="M7.68168 4.73926H1.53634C1.12887 4.73926 0.738102 4.86893 0.449983 5.09974C0.161864 5.33056 0 5.64361 0 5.97003V11.5085C0 11.8349 0.161864 12.148 0.449983 12.3788C0.664791 12.5509 0.936659 12.6667 1.22996 12.7146C1.39768 12.7419 1.53634 12.877 1.53634 13.047C1.53634 13.2169 1.6741 13.3547 1.84403 13.3547H2.76498C2.93491 13.3547 3.07267 13.2169 3.07267 13.047C3.07267 12.877 3.21043 12.7393 3.38037 12.7393H5.83765C6.00759 12.7393 6.14535 12.877 6.14535 13.047C6.14535 13.2169 6.2831 13.3547 6.45304 13.3547H7.37399C7.54392 13.3547 7.68168 13.2169 7.68168 13.047C7.68168 12.877 7.82034 12.7419 7.98806 12.7146C8.28136 12.6667 8.55323 12.5509 8.76804 12.3788C9.05615 12.148 9.21802 11.8349 9.21802 11.5085V5.97003C9.21802 5.64361 9.05615 5.33056 8.76804 5.09974C8.47992 4.86893 8.08914 4.73926 7.68168 4.73926ZM7.68168 7.2008V8.04749C7.68168 8.25961 7.50972 8.43157 7.2976 8.43157C7.08547 8.43157 6.91351 8.25961 6.91351 8.04749V7.81618C6.91351 7.47632 6.638 7.2008 6.29813 7.2008H1.84403C1.67409 7.2008 1.53634 7.06304 1.53634 6.89311C1.53634 6.72317 1.6741 6.58541 1.84403 6.58541H7.0663C7.40616 6.58541 7.68168 6.86093 7.68168 7.2008Z"
                    stroke="none"
                  />
                </svg>
              </span>
              Travel Time
            </Tab>
          </TabList>

          <TabPanel className="mt-6">
            <div className="flex flex-col items-center justify-center text-center gap-6">
              <div className="flex md:flex-row flex-col items-start justify-start md:items-center  gap-14">
                {/* city dropdown */}
                <CityDropdown />
                {/* city dropdown end */}

                {/* neighbourhood dropdown */}
                <NeighbourhoodDropdown />
                {/* neighbourhood dropdown end */}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="flex flex-col items-center justify-center text-center gap-6">
              <div className="flex md:flex-row flex-col items-start justify-start md:items-center  gap-14">
                {/* city dropdown */}
                <CityDropdown />
                {/* city dropdown end */}

                {/* radius dropdown */}
                <div className="flex flex-col gap-1 items-start">
                  <h3 className="font-semibold text-lg text-[#615D5D]">
                    Radius
                  </h3>
                  <div className="relative z-20">
                    <div
                      onClick={(e) => {
                        setIsRadiusActive(!isRadiusActive);
                        e.stopPropagation();
                      }}
                      className={`flex items-center justify-between cursor-pointer bg-[#efefef] xl:hover:bg-[#c1bfbf] transition-all duration-300 rounded-lg py-3 px-4 w-[320px]`}
                    >
                      <h1 className="font-medium text-lg text-[#808080]">
                        {selectedRadius}
                      </h1>
                      <span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="p-icon p-multiselect-trigger-icon p-c"
                          data-pc-section="triggericon"
                        >
                          <path
                            d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    {isRadiusActive && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-[110%] w-[220px] z-20 border bg-white shadow-xl rounded-lg"
                      >
                        <div className="p-4">
                          <div className="flex flex-col justify-start items-start">
                            <h3 className="font-semibold text-[#808080] text-[13px]">
                              Radius
                            </h3>
                            <div className="flex flex-col items-start w-full">
                              {radius.length ? (
                                <div className="flex flex-col items-start justify-start max-h-96 overflow-y-scroll w-full">
                                  {radius.map((radius: Radius) => (
                                    <button
                                      className="font-medium text-lg text-left xl:hover:bg-[#f5f5f5] w-full p-1 rounded-lg"
                                      onClick={() => {
                                        setIsRadiusActive(false);
                                        setSelectedRadius(
                                          `+ ${radius.label} km`
                                        );
                                        setSelectedRadiusValue(radius.value);
                                      }}
                                      key={radius.id}
                                    >
                                      + {radius.label} km
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <h3 className="flex items-center justify-center text-lg font-semibold text-[#484848]">
                                  Radius Not Found
                                </h3>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* radius dropdown end */}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="flex flex-col items-center justify-center text-center gap-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-start w-full sm:w-[600px] md:w-full">
                  <h3 className="font-semibold text-lg text-[#615D5D]">
                    I need to live near
                  </h3>
                  <input
                    className={`cursor-pointer bg-[#efefef] transition-all duration-300 rounded-lg py-3 px-4 w-full`}
                    type="text"
                    placeholder="Enter address"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center md:justify-between md:gap-12 w-full">
                  <div className="flex flex-col items-start w-full sm:w-[200px] md:w-full">
                    <label className="font-bold text-[16px] leading-[24px]">
                      Max travel time
                    </label>
                    <select
                      className={`flex items-center justify-between cursor-pointer bg-[#efefef] xl:hover:bg-[#c1bfbf] transition-all duration-300 rounded-lg py-3 px-4 w-[320px]`}
                      onChange={(e) => setMaxTravelTime(Number(e.target.value))}
                    >
                      {maxTravelTimeOptions.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col items-start w-full sm:w-[200px] md:w-full">
                    <label className="font-bold text-[16px] leading-[24px]">
                      Transport type
                    </label>
                    <select
                      onChange={(e) => setTransportType(e.target.value)}
                      className={`flex items-center justify-between cursor-pointer bg-[#efefef] xl:hover:bg-[#c1bfbf] transition-all duration-300 rounded-lg py-3 px-4 w-[320px]`}
                    >
                      {transportTypeOptions.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>

        <div className="flex flex-col gap-8 items-center justify-center mt-8">
          {/* map */}
          <div className="w-full h-full">
            <Map
              ref={mapRef}
              {...viewport}
              onMove={(viewport) => setViewport(viewport.viewState)}
              style={{
                width: "100%",
                height: "300px",
                cursor: "grab",
                borderRadius: "8px",
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            ></Map>
          </div>
          {/* map end */}

          {!token && (
            <div className="border border-[#0A806C] bg-[#0A806C1A] py-2 px-8 rounded-[5px] w-full">
              <span className="text-[#19191A] block text-center">
                👉Add up to 4 searches after signing up.
              </span>
            </div>
          )}

          <h3 className="font-semibold text-lg">
            With this search you can expect
            <span className="text-main"> {matches} matches </span>per week.
          </h3>
        </div>

        <div className="flex items-center justify-center">
          <Link
            href={token ? "/search" : "/signup"}
            className="bg-main text-white border border-main text-[15px] md:text-[20px] py-3 px-24  font-semibold  xl:hover:bg-transparent xl:hover:text-main rounded-lg transition-all duration-300 ease-in-out w-max"
          >
            Start your search
          </Link>
        </div>
      </div>
    </div>
  );
}
