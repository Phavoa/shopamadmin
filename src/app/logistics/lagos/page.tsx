// src/app/logistics/lagos/page.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, AlertTriangle, X, Plus } from "lucide-react";

interface Order {
  id: string;
  seller?: string;
  buyer?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  phone: string;
  status: string;
}

interface Exception {
  order: string;
  customer: string;
  issue: string;
  address: string;
  phone: string;
  status: string;
}

const PackageIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24.36 7.42791L14.735 2.15823C14.51 2.03394 14.2571 1.96875 14 1.96875C13.7429 1.96875 13.49 2.03394 13.265 2.15823L3.64 7.42791C3.39916 7.55969 3.19818 7.75379 3.0581 7.98989C2.91801 8.22599 2.84398 8.49541 2.84375 8.76995V19.2306C2.84398 19.5051 2.91801 19.7745 3.0581 20.0106C3.19818 20.2467 3.39916 20.4408 3.64 20.5726L13.265 25.8423C13.4901 25.9664 13.743 26.0315 14 26.0315C14.257 26.0315 14.5099 25.9664 14.735 25.8423L24.36 20.5726C24.6008 20.4408 24.8018 20.2467 24.9419 20.0106C25.082 19.7745 25.156 19.5051 25.1562 19.2306V8.76995C25.156 8.49541 25.082 8.22599 24.9419 7.98989C24.8018 7.75379 24.6008 7.55969 24.36 7.42791ZM13.8906 3.30885C13.9228 3.29124 13.9589 3.282 13.9956 3.282C14.0323 3.282 14.0684 3.29124 14.1006 3.30885L23.2433 8.31276L19.5311 10.3439L10.2867 5.28416L13.8906 3.30885ZM13.3438 24.3909L4.26562 19.422C4.23208 19.4026 4.20428 19.3747 4.18506 19.3411C4.16585 19.3074 4.1559 19.2693 4.15625 19.2306V9.47869L13.3438 14.5099V24.3909ZM4.75672 8.31276L8.92062 6.03229L18.1639 11.092L14 13.3703L4.75672 8.31276ZM23.8438 19.2306C23.8441 19.2693 23.8342 19.3074 23.8149 19.3411C23.7957 19.3747 23.7679 19.4026 23.7344 19.422L14.6562 24.3909V14.5078L18.5938 12.352V16.6253C18.5938 16.7993 18.6629 16.9662 18.786 17.0893C18.909 17.2124 19.076 17.2815 19.25 17.2815C19.424 17.2815 19.591 17.2124 19.714 17.0893C19.8371 16.9662 19.9062 16.7993 19.9062 16.6253V11.6345L23.8438 9.47869V19.2306Z"
      fill="currentColor"
    />
  </svg>
);

const LocationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 33 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.4375 11.2105V22.2661C15.4375 22.5023 15.5313 22.7289 15.6984 22.8959C15.8654 23.0629 16.0919 23.1567 16.3281 23.1567C16.5643 23.1567 16.7909 23.0629 16.9579 22.8959C17.1249 22.7289 17.2188 22.5023 17.2188 22.2661V11.2105C18.6196 10.9865 19.8846 10.2429 20.7617 9.12779C21.6387 8.01272 22.0634 6.60811 21.951 5.19391C21.8387 3.77971 21.1976 2.45977 20.1555 1.49717C19.1133 0.534572 17.7468 0 16.3281 0C14.9095 0 13.5429 0.534572 12.5008 1.49717C11.4587 2.45977 10.8176 3.77971 10.7052 5.19391C10.5929 6.60811 11.0175 8.01272 11.8946 9.12779C12.7716 10.2429 14.0366 10.9865 15.4375 11.2105ZM16.3281 1.78174C17.0914 1.78174 17.8376 2.00809 18.4723 2.43217C19.1069 2.85624 19.6016 3.45899 19.8937 4.1642C20.1858 4.86941 20.2623 5.6454 20.1133 6.39405C19.9644 7.14269 19.5969 7.83037 19.0571 8.37011C18.5174 8.90985 17.8297 9.27742 17.0811 9.42634C16.3324 9.57525 15.5564 9.49882 14.8512 9.20672C14.146 8.91461 13.5432 8.41994 13.1192 7.78527C12.6951 7.1506 12.4688 6.40443 12.4688 5.64112C12.4688 4.61755 12.8754 3.6359 13.5991 2.91213C14.3229 2.18836 15.3046 1.78174 16.3281 1.78174ZM32.6562 22.2661C32.6562 24.2463 30.8483 26.0335 27.5634 27.2952C24.5486 28.456 20.5586 29.0942 16.3281 29.0942C12.0977 29.0942 8.10766 28.456 5.09289 27.2952C1.80797 26.0335 0 24.2463 0 22.2661C0 19.3567 3.92766 16.9224 10.2496 15.9041C10.4831 15.8657 10.7222 15.9216 10.9144 16.0596C11.1066 16.1975 11.2362 16.4061 11.2746 16.6396C11.313 16.8731 11.257 17.1122 11.1191 17.3044C10.9812 17.4966 10.7725 17.6262 10.5391 17.6646C7.86719 18.0935 5.60055 18.8016 3.99445 19.71C2.565 20.5146 1.78125 21.423 1.78125 22.2661C1.78125 24.653 7.75586 27.313 16.3281 27.313C24.9004 27.313 30.875 24.653 30.875 22.2661C30.875 21.423 30.0912 20.5146 28.6692 19.7085C27.0631 18.8001 24.7995 18.0921 22.1246 17.6631C21.8914 17.6257 21.6825 17.4971 21.544 17.3058C21.4055 17.1144 21.3487 16.8758 21.3861 16.6426C21.4235 16.4093 21.5521 16.2005 21.7434 16.062C21.9348 15.9235 22.1734 15.8667 22.4066 15.9041C28.7286 16.9224 32.6562 19.3567 32.6562 22.2661Z"
      fill="black"
      fill-opacity="0.8"
    />
  </svg>
);

const BusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_2642_17952)">
      <path
        d="M27.7342 12.8822L26.203 9.05406C26.0902 8.7693 25.8942 8.52514 25.6405 8.35344C25.3869 8.18175 25.0874 8.09049 24.7811 8.09156H20.7812V7C20.7812 6.82595 20.7121 6.65903 20.589 6.53596C20.466 6.41289 20.299 6.34375 20.125 6.34375H3.5C3.09389 6.34375 2.70441 6.50508 2.41724 6.79224C2.13008 7.07941 1.96875 7.46889 1.96875 7.875V20.125C1.96875 20.5311 2.13008 20.9206 2.41724 21.2078C2.70441 21.4949 3.09389 21.6562 3.5 21.6562H5.53437C5.68499 22.398 6.08742 23.0649 6.67346 23.5439C7.25949 24.0229 7.99311 24.2845 8.75 24.2845C9.50689 24.2845 10.2405 24.0229 10.8265 23.5439C11.4126 23.0649 11.815 22.398 11.9656 21.6562H17.7844C17.935 22.398 18.3374 23.0649 18.9235 23.5439C19.5095 24.0229 20.2431 24.2845 21 24.2845C21.7569 24.2845 22.4905 24.0229 23.0765 23.5439C23.6626 23.0649 24.065 22.398 24.2156 21.6562H26.25C26.6561 21.6562 27.0456 21.4949 27.3328 21.2078C27.6199 20.9206 27.7812 20.5311 27.7812 20.125V13.125C27.7811 13.0418 27.7651 12.9594 27.7342 12.8822ZM20.7812 9.40625H24.7822C24.826 9.40621 24.8688 9.41932 24.9051 9.44389C24.9414 9.46846 24.9694 9.50336 24.9856 9.54406L26.1559 12.4687H20.7812V9.40625ZM3.28125 7.875C3.28125 7.81698 3.3043 7.76134 3.34532 7.72032C3.38634 7.6793 3.44198 7.65625 3.5 7.65625H19.4688V15.0937H3.28125V7.875ZM8.75 22.9687C8.36062 22.9687 7.97998 22.8533 7.65622 22.637C7.33246 22.4206 7.08012 22.1131 6.93111 21.7534C6.7821 21.3937 6.74311 20.9978 6.81908 20.6159C6.89504 20.234 7.08255 19.8832 7.35788 19.6079C7.63322 19.3325 7.98402 19.145 8.36592 19.0691C8.74782 18.9931 9.14367 19.0321 9.50341 19.1811C9.86315 19.3301 10.1706 19.5825 10.387 19.9062C10.6033 20.23 10.7188 20.6106 10.7188 21C10.7188 21.5221 10.5113 22.0229 10.1421 22.3921C9.7729 22.7613 9.27214 22.9687 8.75 22.9687ZM17.7844 20.3437H11.9656C11.815 19.602 11.4126 18.9351 10.8265 18.4561C10.2405 17.9771 9.50689 17.7155 8.75 17.7155C7.99311 17.7155 7.25949 17.9771 6.67346 18.4561C6.08742 18.9351 5.68499 19.602 5.53437 20.3437H3.5C3.44198 20.3437 3.38634 20.3207 3.34532 20.2797C3.3043 20.2387 3.28125 20.183 3.28125 20.125V16.4062H19.4688V18.0994C19.04 18.3263 18.6666 18.6451 18.3755 19.0331C18.0843 19.4211 17.8824 19.8687 17.7844 20.3437ZM21 22.9687C20.6106 22.9687 20.23 22.8533 19.9062 22.637C19.5825 22.4206 19.3301 22.1131 19.1811 21.7534C19.0321 21.3937 18.9931 20.9978 19.0691 20.6159C19.145 20.234 19.3325 19.8832 19.6079 19.6079C19.8832 19.3325 20.234 19.145 20.6159 19.0691C20.9978 18.9931 21.3937 19.0321 21.7534 19.1811C22.1131 19.3301 22.4206 19.5825 22.637 19.9062C22.8533 20.23 22.9688 20.6106 22.9688 21C22.9688 21.5221 22.7613 22.0229 22.3921 22.3921C22.0229 22.7613 21.5221 22.9687 21 22.9687ZM26.4688 20.125C26.4688 20.183 26.4457 20.2387 26.4047 20.2797C26.3637 20.3207 26.308 20.3437 26.25 20.3437H24.2156C24.0634 19.6031 23.6604 18.9375 23.0746 18.4594C22.4889 17.9812 21.7562 17.7196 21 17.7187C20.9267 17.7187 20.8534 17.7188 20.7812 17.7264V13.7812H26.4688V20.125Z"
        fill="#E67E22"
      />
    </g>
    <defs>
      <clipPath id="clip0_2642_17952">
        <rect width="28" height="28" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const RiderIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24.3438 11.5781C25.1071 11.5781 25.8532 11.3518 26.4879 10.9277C27.1226 10.5036 27.6172 9.90088 27.9094 9.19567C28.2015 8.49046 28.2779 7.71447 28.129 6.96582C27.9801 6.21718 27.6125 5.5295 27.0727 4.98976C26.533 4.45002 25.8453 4.08245 25.0967 3.93353C24.348 3.78462 23.572 3.86105 22.8668 4.15315C22.1616 4.44526 21.5589 4.93993 21.1348 5.5746C20.7107 6.20927 20.4844 6.95544 20.4844 7.71875C20.4844 8.74232 20.891 9.72397 21.6148 10.4477C22.3385 11.1715 23.3202 11.5781 24.3438 11.5781ZM24.3438 5.64063C24.7548 5.64063 25.1566 5.76251 25.4983 5.99085C25.84 6.2192 26.1064 6.54376 26.2637 6.92349C26.421 7.30322 26.4621 7.72106 26.3819 8.12417C26.3018 8.52729 26.1038 8.89758 25.8132 9.18821C25.5226 9.47884 25.1523 9.67676 24.7492 9.75695C24.3461 9.83713 23.9282 9.79598 23.5485 9.63869C23.1688 9.4814 22.8442 9.21504 22.6159 8.8733C22.3875 8.53155 22.2656 8.12977 22.2656 7.71875C22.2656 7.1676 22.4846 6.63902 22.8743 6.2493C23.264 5.85957 23.7926 5.64063 24.3438 5.64063ZM29.6875 20.4844C28.5719 20.4844 27.4813 20.8152 26.5537 21.435C25.6261 22.0548 24.9032 22.9357 24.4762 23.9664C24.0493 24.9971 23.9376 26.1313 24.1553 27.2254C24.3729 28.3196 24.9101 29.3247 25.699 30.1135C26.4878 30.9024 27.4929 31.4396 28.5871 31.6572C29.6812 31.8749 30.8154 31.7632 31.8461 31.3363C32.8768 30.9093 33.7577 30.1864 34.3775 29.2588C34.9973 28.3312 35.3281 27.2406 35.3281 26.125C35.3281 24.629 34.7338 23.1943 33.676 22.1365C32.6182 21.0787 31.1835 20.4844 29.6875 20.4844ZM29.6875 29.9844C28.9242 29.9844 28.178 29.758 27.5433 29.334C26.9087 28.9099 26.414 28.3071 26.1219 27.6019C25.8298 26.8967 25.7534 26.1207 25.9023 25.3721C26.0512 24.6234 26.4188 23.9358 26.9585 23.396C27.4983 22.8563 28.1859 22.4887 28.9346 22.3398C29.6832 22.1909 30.4592 22.2673 31.1644 22.5594C31.8696 22.8515 32.4724 23.3462 32.8965 23.9808C33.3205 24.6155 33.5469 25.3617 33.5469 26.125C33.5469 26.6318 33.4471 27.1337 33.2531 27.6019C33.0591 28.0702 32.7749 28.4956 32.4165 28.854C32.0581 29.2124 31.6327 29.4966 31.1644 29.6906C30.6962 29.8846 30.1943 29.9844 29.6875 29.9844ZM8.3125 20.4844C7.19689 20.4844 6.10634 20.8152 5.17874 21.435C4.25114 22.0548 3.52817 22.9357 3.10124 23.9664C2.67432 24.9971 2.56262 26.1313 2.78026 27.2254C2.99791 28.3196 3.53512 29.3247 4.32398 30.1135C5.11283 30.9024 6.1179 31.4396 7.21207 31.6572C8.30625 31.8749 9.44039 31.7632 10.4711 31.3363C11.5018 30.9093 12.3827 30.1864 13.0025 29.2588C13.6223 28.3312 13.9531 27.2406 13.9531 26.125C13.9531 24.629 13.3588 23.1943 12.301 22.1365C11.2432 21.0787 9.80849 20.4844 8.3125 20.4844ZM8.3125 29.9844C7.54919 29.9844 6.80302 29.758 6.16835 29.334C5.53368 28.9099 5.03901 28.3071 4.7469 27.6019C4.4548 26.8967 4.37837 26.1207 4.52728 25.3721C4.6762 24.6234 5.04377 23.9358 5.58351 23.396C6.12326 22.8563 6.81093 22.4887 7.55958 22.3398C8.30822 22.1909 9.08421 22.2673 9.78942 22.5594C10.4946 22.8515 11.0974 23.3462 11.5215 23.9808C11.9455 24.6155 12.1719 25.3617 12.1719 26.125C12.1719 27.1486 11.7653 28.1302 11.0415 28.854C10.3177 29.5778 9.33607 29.9844 8.3125 29.9844ZM28.5 17.5156H22.5625C22.3264 17.5154 22.1 17.4214 21.9331 17.2544L17.8125 13.1352L14.3227 16.625L19.6294 21.9331C19.7964 22.1 19.8904 22.3264 19.8906 22.5625V29.6875C19.8906 29.9237 19.7968 30.1502 19.6298 30.3173C19.4627 30.4843 19.2362 30.5781 19 30.5781C18.7638 30.5781 18.5373 30.4843 18.3702 30.3173C18.2032 30.1502 18.1094 29.9237 18.1094 29.6875V22.9321L12.4331 17.2544C12.2663 17.0874 12.1727 16.861 12.1727 16.625C12.1727 16.389 12.2663 16.1626 12.4331 15.9956L17.1831 11.2456C17.3501 11.0788 17.5765 10.9852 17.8125 10.9852C18.0485 10.9852 18.2749 11.0788 18.4419 11.2456L22.9321 15.7344H28.5C28.7362 15.7344 28.9627 15.8282 29.1298 15.9952C29.2968 16.1623 29.3906 16.3888 29.3906 16.625C29.3906 16.8612 29.2968 17.0877 29.1298 17.2548C28.9627 17.4218 28.7362 17.5156 28.5 17.5156Z"
      fill="black"
    />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 38 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.7661 10.6875C31.3736 10.6878 30.9821 10.7286 30.5979 10.8092L29.5247 8.01563C30.2555 7.81828 31.0092 7.71845 31.7661 7.71875C32.0023 7.71875 32.2289 7.62492 32.3959 7.45789C32.5629 7.29087 32.6567 7.06433 32.6567 6.82813C32.6567 6.59192 32.5629 6.36538 32.3959 6.19836C32.2289 6.03133 32.0023 5.9375 31.7661 5.9375H28.7246L26.6599 0.571484C26.5953 0.403355 26.4814 0.258738 26.333 0.156713C26.1846 0.0546872 26.0087 4.68939e-05 25.8286 0H21.0786C20.8424 0 20.6159 0.0938333 20.4489 0.260858C20.2818 0.427883 20.188 0.654417 20.188 0.890625C20.188 1.12683 20.2818 1.35337 20.4489 1.52039C20.6159 1.68742 20.8424 1.78125 21.0786 1.78125H25.2171L26.8157 5.9375H22.2661C19.5942 5.9375 17.43 6.55352 16.0169 7.71875C15.6283 8.03265 15.1597 8.23166 14.6639 8.2933C14.1682 8.35494 13.6651 8.27676 13.2114 8.06758C11.2669 7.18141 4.21612 4.33289 3.56299 4.07609L2.71393 3.74359C2.51261 3.65125 2.29837 3.59018 2.07862 3.5625C1.87067 3.56264 1.66933 3.63554 1.50949 3.76857C1.34966 3.90159 1.24141 4.08635 1.20351 4.29082C1.16561 4.49528 1.20046 4.70656 1.302 4.88803C1.40355 5.0695 1.56539 5.20972 1.75948 5.28438C1.82776 5.31109 8.75534 7.99484 12.4811 9.68852C13.2379 10.0339 14.076 10.1614 14.9013 10.0565C15.7265 9.95157 16.5061 9.61852 17.1524 9.09477C18.242 8.20414 20.0099 7.72172 22.2676 7.72172H25.9622C23.9162 9.09774 22.4262 11.1565 21.7585 13.5301C21.597 14.0834 21.2595 14.569 20.7972 14.9132C20.3348 15.2575 19.7728 15.4415 19.1964 15.4375H11.2105C10.9865 14.0366 10.2429 12.7716 9.12779 11.8946C8.01272 11.0175 6.60811 10.5929 5.19391 10.7052C3.77971 10.8176 2.45977 11.4587 1.49717 12.5008C0.534572 13.5429 0 14.9095 0 16.3281C0 17.7468 0.534572 19.1133 1.49717 20.1555C2.45977 21.1976 3.77971 21.8387 5.19391 21.951C6.60811 22.0634 8.01272 21.6387 9.12779 20.7617C10.2429 19.8846 10.9865 18.6196 11.2105 17.2188H19.1964C20.1616 17.2211 21.1012 16.9088 21.8729 16.3292C22.6446 15.7495 23.2063 14.9341 23.4729 14.0066C23.7956 12.8607 24.3524 11.7942 25.1081 10.8744C25.8639 9.95462 26.8022 9.20157 27.8637 8.66281L28.9369 11.4534C27.7547 12.1417 26.8629 13.2361 26.4275 14.533C25.9922 15.8298 26.0429 17.2407 26.5704 18.5029C27.0978 19.7651 28.0659 20.7926 29.2945 21.3941C30.5231 21.9957 31.9284 22.1302 33.2489 21.7728C34.5693 21.4153 35.7148 20.5901 36.4722 19.451C37.2295 18.3118 37.5471 16.9362 37.3657 15.5803C37.1844 14.2244 36.5164 12.9806 35.4863 12.0805C34.4562 11.1804 33.1341 10.6854 31.7661 10.6875ZM5.64112 17.2188H9.3951C9.17681 18.1392 8.6281 18.9473 7.85317 19.4898C7.07825 20.0323 6.13108 20.2713 5.19155 20.1614C4.25202 20.0515 3.38557 19.6004 2.75675 18.8937C2.12792 18.187 1.78052 17.2741 1.78052 16.3281C1.78052 15.3822 2.12792 14.4692 2.75675 13.7625C3.38557 13.0559 4.25202 12.6048 5.19155 12.4949C6.13108 12.385 7.07825 12.624 7.85317 13.1665C8.6281 13.7089 9.17681 14.5171 9.3951 15.4375H5.64112C5.40491 15.4375 5.17838 15.5313 5.01135 15.6984C4.84433 15.8654 4.75049 16.0919 4.75049 16.3281C4.75049 16.5643 4.84433 16.7909 5.01135 16.9579C5.17838 17.1249 5.40491 17.2188 5.64112 17.2188ZM31.7661 20.1875C30.9421 20.1871 30.1399 19.9229 29.4768 19.4337C28.8138 18.9445 28.3247 18.256 28.0812 17.4688C27.8376 16.6816 27.8524 15.8371 28.1234 15.059C28.3944 14.2808 28.9073 13.6098 29.5871 13.1441L30.9349 16.6473C31.0231 16.8627 31.1922 17.0351 31.4059 17.1274C31.6196 17.2197 31.861 17.2247 32.0783 17.1412C32.2956 17.0578 32.4717 16.8926 32.5687 16.6809C32.6657 16.4693 32.676 16.2281 32.5974 16.009L31.2496 12.5044C31.4208 12.4812 31.5933 12.4693 31.7661 12.4688C32.7897 12.4688 33.7713 12.8754 34.4951 13.5991C35.2189 14.3229 35.6255 15.3046 35.6255 16.3281C35.6255 17.3517 35.2189 18.3333 34.4951 19.0571C33.7713 19.7809 32.7897 20.1875 31.7661 20.1875Z"
      fill="currentColor"
    />
  </svg>
);

export default function LagosHubDashboard() {
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  // Mock data
  const kpis = {
    ordersToday: 128,
    pickRequests: 22,
    atHub: 44,
    waitingForDelivery: 38,
    exceptions: 4,
  };

  const pickupRequests: Order[] = [
    {
      id: "SA20016",
      seller: "John D.",
      pickupAddress: "16 Allam Ave, Ikeja",
      phone: "0802 111 222",
      status: "Pending",
    },
    {
      id: "SA20011",
      seller: "Mary K.",
      pickupAddress: "13 Bode Thomas, Surulere",
      phone: "0813 222 333",
      status: "Awaiting Seller Shipment",
    },
    {
      id: "SA20010",
      seller: "John D.",
      pickupAddress: "16 Allam Ave, Ikeja",
      phone: "0802 111 222",
      status: "In Transit to Shopam",
    },
  ];

  const deliveries: Order[] = [
    {
      id: "SA20013",
      buyer: "John D.",
      deliveryAddress: "Lekki Phase 1, Lagos",
      phone: "0802 111 222",
      status: "At Hub",
    },
    {
      id: "SA20011",
      buyer: "Mary K.",
      deliveryAddress: "13 Bode Thomas, Surulere",
      phone: "0813 222 333",
      status: "Assigned (Rider A)",
    },
    {
      id: "SA20010",
      buyer: "John D.",
      deliveryAddress: "Yaba, Lagos",
      phone: "0802 111 222",
      status: "Delivered",
    },
  ];

  const exceptions: Exception[] = [
    {
      order: "SA0018",
      customer: "Mary K.",
      issue: "Phone not reachable",
      address: "13 Bode Thomas, Surulere",
      phone: "0802 111 222",
      status: "Exception",
    },
    {
      order: "SA0019",
      customer: "Jane Doe",
      issue: "Parcel damaged at hub",
      address: "2 Platinum Way, Lekki",
      phone: "0802 111 222",
      status: "Exception",
    },
    {
      order: "SA0018",
      customer: "John D.",
      issue: "Pickup overdue >24h",
      address: "13 Bode Thomas, Surulere",
      phone: "0802 111 222",
      status: "Exception",
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Pending: "bg-gray-200 text-gray-800",
      "Awaiting Seller Shipment": "bg-orange-200",
      "In Transit to Shopam": "bg-green-200 text-green-800",
      "At Hub": "bg-blue-200",
      "Assigned (Rider A)": "bg-orange-200",
      Delivered: "bg-green-200 text-green-800",
      Exception: "bg-red-200 text-red-500",
    };
    return statusMap[status] || "bg-gray-200";
  };

  const handleAssignRider = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowAssignRiderModal(true);
  };

  const handleInvestigate = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowInvestigateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lagos Hub Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time logistics management and order tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddRiderModal(true)}
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Rider
          </Button>

          <Button
            onClick={() => setShowAddShopModal(true)}
            className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Shop
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-2xl font-bold">{kpis.ordersToday}</div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-sm text-gray-600 font-medium">
                Orders Today
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-2xl font-bold">{kpis.pickRequests}</div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-sm text-gray-600 font-medium">
                Pick Requests
              </h2>
            </div>
          </div>
        </Card>

        {/* At Hub */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-2xl font-bold">{kpis.atHub}</div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-sm text-gray-600 font-medium">At Hub</h2>
            </div>
          </div>
        </Card>

        {/* Out for Delivery */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-2xl font-bold">{kpis.waitingForDelivery}</div>
            <div className="flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-sm text-gray-600 font-medium">
                Out for Delivery
              </h2>
            </div>
          </div>
        </Card>

        {/* Exceptions */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-2xl font-bold">{kpis.exceptions}</div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-sm text-gray-600 font-medium">Exceptions</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Pickup Requests Table */}
      <Card className="mb-6">
        <div className="p-4 border-b flex items-center gap-2">
          <PackageIcon className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-lg">
            Pickup Requests (Seller → Hub)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Seller
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Pickup Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pickupRequests.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.seller}</td>
                  <td className="px-4 py-3 text-sm">{order.pickupAddress}</td>
                  <td className="px-4 py-3 text-sm">{order.phone}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} text-gray-800`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAssignRider(order.id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Assign Rider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-white bg-green-700 hover:bg-green-800"
                      >
                        Done
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Deliveries Table */}
      <Card className="mb-6">
        <div className="p-4 border-b flex items-center gap-2">
          <PackageIcon className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-lg">Deliveries (Hub → Buyer)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Delivery Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.buyer}</td>
                  <td className="px-4 py-3 text-sm">{order.deliveryAddress}</td>
                  <td className="px-4 py-3 text-sm">{order.phone}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} text-gray-800`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAssignRider(order.id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Assign Rider
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowTrackOrderModal(true)}
                        variant="outline"
                        className="border-green-500 text-white bg-green-700 hover:bg-green-800"
                      >
                        Track
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rider Status */}
      <Card className="mb-6">
        <div className="p-4 border-b flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-orange-600" />
          <h2 className="font-semibold text-lg">Rider Status</h2>
        </div>
        <div className="p-5 flex gap-45">
          <Button className="bg-green-500 hover:bg-green-600">
            Rider Paul - Available
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            Rider Obi - On Delivery
          </Button>
          <Button className="bg-blue-700 hover:bg-blue-800">
            Rider Seyi - Picking Up
          </Button>
          <Button className="bg-gray-500 hover:bg-gray-600">
            Rider Ahmed - Offline
          </Button>
        </div>
      </Card>

      {/* Exceptions Table */}
      <Card>
        <div className="p-4 border-b flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-lg">Exceptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Issue
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map((exception, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{exception.order}</td>
                  <td className="px-4 py-3 text-sm">{exception.customer}</td>
                  <td className="px-4 py-3 text-sm">{exception.issue}</td>
                  <td className="px-4 py-3 text-sm">{exception.address}</td>
                  <td className="px-4 py-3 text-sm">{exception.phone}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`${getStatusColor(
                        exception.status
                      )} text-gray-800`}
                    >
                      {exception.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleInvestigate(exception.order)}
                        variant="outline"
                        className="border-green-500 text-white bg-green-700 hover:bg-green-800"
                      >
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Manage Issue
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Rider Modal */}
      {showAddRiderModal && (
        <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowAddRiderModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <RiderIcon className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Add New Rider</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Input id="name" placeholder="Enter rider name" />
              </div>
              <div>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Input id="bikeType" placeholder="Enter ride type" />
              </div>
              <div>
                <Input id="plate" placeholder="Enter plate number" />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                + Add Rider
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shop Modal */}
      {showAddShopModal && (
        <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowAddShopModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <LocationIcon className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Add New Parcel Shop</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Input id="shopAddress" placeholder="Enter shop address" />
              </div>
              <div>
                <Input id="shopPhone" placeholder="Enter phone number" />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                + Add Shop
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Rider Modal */}
      {showAssignRiderModal && (
        <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowAssignRiderModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <RiderIcon className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Assign Rider</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select a Rider for this Order
            </p>
            <div className="space-y-4">
              <div>
                <select
                  id="rider"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Rider</option>
                  <option value="rider1">John Rider - Available</option>
                  <option value="rider2">Mary Rider - Available</option>
                  <option value="rider3">David Rider - Available</option>
                </select>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Assign Rider
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {showTrackOrderModal && (
        <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowTrackOrderModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold">Track Order</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Input id="trackingId" placeholder="Enter tracking ID" />
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center gap-2">
                  Mark as Pick up (In transit to shopam)
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  Mark as Received at Hub
                </Button>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2">
                  <TruckIcon className="w-4 h-4" />
                  Mark as Out for Delivery
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  Mark as Delivered
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Each step is updated by staff/riders and reflects live for both
                buyer & seller.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investigate Exception Modal */}
      {showInvestigateModal && (
        <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-2xl">
            <button
              onClick={() => setShowInvestigateModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold">
                Investigate Exception - Order {selectedOrder}
              </h2>
            </div>

            {/* Order Details */}
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="font-semibold">Order & Buyer Details</span>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Order ID:</span> {selectedOrder}
                </p>
                <p>
                  <span className="font-medium">Buyer:</span> Jane Doe 🇳🇬
                  (📱0813 466 7880)
                </p>
                <p>
                  <span className="font-medium">Seller:</span> Mary K. 🇨🇦
                  (📱0813 222 333)
                </p>
                <p>
                  <span className="font-medium">Hub:</span> Lagos Main Hub
                </p>
                <p>
                  <span className="font-medium">Date Delivered:</span> 2 April,
                  2025
                </p>
              </div>
            </div>

            {/* Reported Issue */}
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-semibold">Reported Issue</span>
            </div>
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Reported by:</span> Buyer
                </p>
                <p>
                  <span className="font-medium">Reason:</span> Wrong item
                  delivered
                </p>
                <p>
                  <span className="font-medium">Buyer Note:</span> &quot;I
                  ordered iPhone 12 but got iPhone X&quot;
                </p>
                <p>
                  <span className="font-medium">Seller Reply:</span> &quot;Sent
                  correct item (photo attached)&quot;
                </p>
              </div>
            </div>

            {/* Staff Actions */}
            <div>
              <h3 className="font-semibold mb-3">Staff Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Contact Buyer
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Contact Seller
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Request More Evidence
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  Approve Refund
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  Send Replacement
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Close (No Issue)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
